import { useFocusEffect } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { StatisticsData } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutServices from '../../webservices/workouts'
import * as WorkoutSessionsServices from '../../webservices/workoutSessions'
import { StatsCard } from './statsCard'
import { UnfinishedWorkoutCard } from './unfinishedWorkoutCard'

const statsPoster = require('./summax-stats-poster.png')

export function StatsScreen() {
  const dispatch = useDispatch()
  const { workoutCatalog } = useSelector(({ contents: { workoutCatalog } }: GlobalState) => ({
    workoutCatalog
  }))
  const [isLoading, setLoading] = useState(true)
  const [statisticsData, setStatisticsData] = useState(Maybe.nothing<StatisticsData>())
  const keyExtractor = useCallback((workout, index) => workout === null ? 'poster' : `${workout.id}${index}`, [])
  const renderItem = useCallback(({ item: workout }) => {
    if (workout === null) {
      return <Image resizeMode={'contain'} source={statsPoster} style={styles.poster}/>
    }

    return <UnfinishedWorkoutCard workout={workout} completionRatio={workout.completionRatio}/>
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
        completionRatio: session.doneExerciseCount / session.totalExerciseCount
      })
    }),
    nothing: () => []
  }), [statisticsData.valueOr(null), Object.keys(workoutCatalog).map(key => JSON.stringify(workoutCatalog[key])).join('')])

  return isLoading ? (
    <Loading/>
  ) : (statisticsData.caseOf({
      just      : statistics => (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

          <Layout style={styles.mainContainer}>

            <Text style={[styles.title, { marginBottom: 36, marginTop: 45 }]}>{i18n.t('Statistics - Workouts')}</Text>

            <StatsCard
              firstTrainingDate={new Date()}
              trainingCount={statistics.sessionCount}
              trainingTimeMinutes={Math.floor(statistics.timeSpentMs / 60000)}
              style={{ marginBottom: 52 }}
            />

            <Text style={[styles.subtitle, { marginBottom: 22 }]}>{i18n.t('Statistics - Unfinished Workouts')}</Text>

            {unfinishedWorkouts.length === 0 ? (
              <Layout style={{ flex: 1 }}>
                <Text style={styles.workoutTitle}>{i18n.t('Statistics - No unfinished workout')}</Text>
                <Layout style={{ flex: 1 }}/>
                <Image resizeMode={'contain'} source={statsPoster} style={styles.poster}/>
              </Layout>
            ) : (
              <FlatList
                data={unfinishedWorkouts.concat(null)}
                keyExtractor={keyExtractor}
                removeClippedSubviews={true}
                renderItem={renderItem}
              />
            )}

          </Layout>

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
})