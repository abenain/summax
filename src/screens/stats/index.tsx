import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { PremiumBanner } from '../../components/premium-banner'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { StatisticsData, Workout } from '../../types'
import { isPremium } from '../../utils'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutServices from '../../webservices/workouts'
import * as WorkoutSessionsServices from '../../webservices/workoutSessions'
import { StatsCard } from './statsCard'
import { UnfinishedWorkoutCard } from './unfinishedWorkoutCard'

const statsPoster = require('./summax-stats-poster.png')

export function StatsScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { workoutCatalog } = useSelector(({ contents: { workoutCatalog } }: GlobalState) => ({
    workoutCatalog
  }))
  const { subscriptionPeriodEnd } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))
  const userIsPremium = isPremium(subscriptionPeriodEnd)
  const [isLoading, setLoading] = useState(true)
  const [statisticsData, setStatisticsData] = useState(Maybe.nothing<StatisticsData>())
  const resumeWorkout = useCallback((workout: Workout, startAtExercise: number) => {
    dispatch({
      type     : ActionType.SELECTED_WORKOUT,
      workoutId: Maybe.just(workout.id)
    })

    setLoading(true)
    callAuthenticatedWebservice(WorkoutServices.load, { workoutId: workout.id })
      .then((workout: Maybe<Workout>) => {
        dispatch({
          type    : ActionType.UPDATE_WORKOUT_CATALOG,
          workouts: workout.map(workout => [workout])
        })

        setLoading(false)

        navigation.navigate('Training', {
          startAtExercise
        })
      })
  }, [])

  function loadStatistics() {
    return callAuthenticatedWebservice(WorkoutSessionsServices.loadStatistics)
      .then(maybeStatisticsData => {
        return maybeStatisticsData.caseOf({
          just   : (statisticsData) => {
            setStatisticsData(maybeStatisticsData)

            return callAuthenticatedWebservice(WorkoutServices.fetchWorkouts, {
              filter: {
                type : 'id',
                value: statisticsData.unfinishedSessions.map(session => session.workoutId).join(','),
              }
            }).then(workouts => {
              dispatch({
                type: ActionType.UPDATE_WORKOUT_CATALOG,
                workouts,
              })
            })
          },
          nothing: () => {
          },
        })
      })
  }

  useFocusEffect(useCallback(() => {
    setLoading(true)
    loadStatistics().then(() => setLoading(false))
  }, []))

  const unfinishedWorkouts = useMemo(() => statisticsData.caseOf({
    just   : statistics => statistics.unfinishedSessions.map(session => {
      return ({
        ...workoutCatalog[session.workoutId],
        doneExerciseCount : session.doneExerciseCount,
        totalExerciseCount: session.totalExerciseCount,
      })
    }),
    nothing: () => []
  }), [statisticsData.valueOr(null), Object.keys(workoutCatalog).map(key => JSON.stringify(workoutCatalog[key])).join('')])

  const ViewContainer = userIsPremium ? ScrollView : View

  return isLoading ? (
    <Loading/>
  ) : (statisticsData.caseOf({
      just      : statistics => (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

          {userIsPremium === false && (
            <View style={{ paddingVertical: 24 }}>
              <PremiumBanner canHideBanner={false} isPremium={false}/>
            </View>
          )}

          <ViewContainer style={styles.mainContainer}>

            {userIsPremium === false && (<View style={styles.dimmer}/>)}

            <Text style={[styles.title, { marginBottom: 36, marginTop: 45 }]}>{i18n.t('Statistics - Workouts')}</Text>

            <StatsCard
              firstTrainingDate={statistics.oldestSessionCreationDate}
              trainingCount={statistics.sessionCount}
              trainingTimeMinutes={Math.floor(statistics.timeSpentMs / 60000)}
              style={{ marginBottom: 52 }}
              userIsPremium={userIsPremium}
            />

            <Text style={[styles.subtitle, { marginBottom: 22 }]}>{i18n.t('Statistics - Unfinished Workouts')}</Text>

            {unfinishedWorkouts.length === 0 ? (
              <>
                <Text style={styles.workoutTitle}>{i18n.t('Statistics - No unfinished workout')}</Text>
                <Image resizeMode={'contain'} source={statsPoster} style={[styles.poster, { marginTop: 32 }]}/>
              </>
            ) : (
              <>
                {unfinishedWorkouts.map((workout, index) => (
                  <UnfinishedWorkoutCard
                    key={`${workout.id}${index}`}
                    workout={workout}
                    completionRatio={workout.doneExerciseCount / workout.totalExerciseCount}
                    onResumeWorkout={() => resumeWorkout(workout, workout.doneExerciseCount)}
                  />
                ))}

                <Image resizeMode={'contain'} source={statsPoster} style={styles.poster}/>
              </>
            )}

          </ViewContainer>

        </SafeAreaView>
      ), nothing: () => (
        <ErrorPage/>
      )
    })

  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex             : 1,
    paddingHorizontal: 16,
  },
  title        : {
    color     : 'black',
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 30,
  },
  subtitle     : {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 18,
  },
  workoutTitle : {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 24,
  },
  poster       : {
    marginBottom: 53,
    width       : '100%',
    height      : 85,
  },
  dimmer       : {
    position       : 'absolute',
    top            : 0,
    bottom         : 0,
    left           : 0,
    right          : 0,
    backgroundColor: 'rgba(100, 100, 100, .7)',
    zIndex         : 100
  }
})