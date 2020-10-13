import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { SummaxColors } from '../../colors'
import { Loading } from '../../components/Loading'
import { Separator } from '../../components/separator'
import { Style as WorkoutCardStyle, WorkoutCard } from '../../components/workout-card'
import { useNavigateToWorkout } from '../../hooks/useNavigateToWorkout'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { Workout } from '../../types'
import { PosterAspectRatio } from '../../utils'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutServices from '../../webservices/workouts'
import * as WorkoutSessionServices from '../../webservices/workoutSessions'
import { MyWorkoutCard } from './myWorkoutCard'

const { width: screenWidth } = Dimensions.get('window')

export function MyWorkoutsScreen() {
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { user, workoutCatalog } = useSelector(({ contents: { workoutCatalog }, userData: { user } }: GlobalState) => ({
    user,
    workoutCatalog
  }))
  const [latestUnfinishedWorkout, setLatestUnfinishedWorkout] = useState(Maybe.nothing<Workout>())
  const navigateToWorkout = useNavigateToWorkout()

  const favoriteWorkouts = useMemo(() => user.caseOf({
    just   : user => user.favoriteWorkouts.map(id => workoutCatalog[id]),
    nothing: () => []
  }), [user.caseOf({
    just   : user => user.favoriteWorkouts.join(','),
    nothing: () => null
  }), workoutCatalog])

  function loadFavorites() {
    return callAuthenticatedWebservice(WorkoutServices.loadFavorites)
      .then(workouts => {
        dispatch({
          type: ActionType.UPDATE_WORKOUT_CATALOG,
          workouts,
        })
      })
  }

  function loadLatestUnfinished() {
    return callAuthenticatedWebservice(WorkoutSessionServices.fetchLatestUnfinished)
      .then(workout => {
        dispatch({
          type    : ActionType.UPDATE_WORKOUT_CATALOG,
          workouts: workout.map(workout => [workout]),
        })
        setLatestUnfinishedWorkout(workout)
      })
  }

  useEffect(function componentDidMount() {
    setLoading(true)

    Promise.all([
      loadFavorites(),
      loadLatestUnfinished()
    ]).then(() => setLoading(false))
  }, [])

  function remove(workoutId) {
    setLoading(true)

    dispatch({
      type    : ActionType.UPDATE_WORKOUT_CATALOG,
      workouts: Maybe.just([{
        ...workoutCatalog[workoutId],
        favorite: false,
      }])
    })

    callAuthenticatedWebservice(WorkoutServices.removeFromFavorites, { workoutId })
      .then(user => user.caseOf({
        just   : () => {
          dispatch({
            type: ActionType.LOADED_USERDATA,
            user,
          })
        },
        nothing: () => {
          dispatch({
            type    : ActionType.UPDATE_WORKOUT_CATALOG,
            workouts: Maybe.just([{
              ...workoutCatalog[workoutId],
              favorite: false,
            }])
          })
        }
      }))
      .then(() => setLoading(false))
  }

  const keyExtractor = useCallback((workout, index) => `${workout.id}${index}`, [])
  const renderItem = useCallback((workout, index) => {

    if (!workout) {
      return null
    }

    return (
      <MyWorkoutCard
        key={keyExtractor(workout, index)}
        navigateToWorkout={navigateToWorkout}
        remove={remove}
        style={(favoriteWorkouts.length === 1 || index === favoriteWorkouts.length - 1) ? {} : {
          borderBottomWidth: 1,
          borderColor      : SummaxColors.darkGrey
        }}
        workout={workout}
      />
    )
  }, [])

  const cardHeight = Math.round((screenWidth - 32) * PosterAspectRatio.workoutCard)
  const margin = (cardHeight - 102) / 2

  return isLoading ? (
    <Loading/>
  ) : (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

      <ScrollView style={[styles.mainPadding, { flex: 1 }]}>

        {latestUnfinishedWorkout.caseOf({
          just   : workout => (
            <>
              <Text style={[styles.title, { marginVertical: 30 }]}>{i18n.t('My Workouts - Resume')}</Text>
              <Layout>
                <Layout style={{
                  position       : 'absolute',
                  height         : 102,
                  top            : margin,
                  left           : -16,
                  right          : -16,
                  backgroundColor: SummaxColors.lightishGreen
                }}/>
                <WorkoutCard
                  cardStyle={WorkoutCardStyle.WORKOUT_LARGE}
                  onPress={() => navigateToWorkout(workout)}
                  showPlayButton={true}
                  themeOrWorkout={workout}
                />
              </Layout>
              <Separator style={{ marginTop: 30 }}/>
            </>
          ),
          nothing: () => null,
        })}

        <Layout style={{ marginBottom: 17, marginTop: 45, }}>
          <Text style={[styles.title, { marginBottom: 30 }]}>{i18n.t('My Workouts - To Do')}</Text>
          <Text style={styles.subtitle}>{i18n.t('My Workouts - Favorite workouts')} :</Text>
        </Layout>

        {favoriteWorkouts.length === 0 ? (
          <Text style={[styles.workoutTitle, { marginTop: 16 }]}>{i18n.t('My Workouts - No favorite workout')}</Text>
        ) : (
          favoriteWorkouts.map(renderItem)
        )}

      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainPadding : {
    paddingHorizontal: 16,
  },
  title       : {
    color     : 'black',
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 30,
  },
  subtitle    : {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 18,
  },
  workoutTitle: {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 24,
  },
})