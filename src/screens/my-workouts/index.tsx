import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SummaxColors } from '../../colors'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { Workout } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutServices from '../../webservices/workouts'
import { MyWorkoutCard } from './myWorkoutCard'

export function MyWorkoutsScreen() {
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { user, workoutCatalog } = useSelector(({ contents: { workoutCatalog }, userData: { user } }: GlobalState) => ({
    user,
    workoutCatalog
  }))

  function loadFavorites() {
    return callAuthenticatedWebservice(WorkoutServices.loadFavorites)
      .then(workouts => {
        dispatch({
          type: ActionType.LOADED_FAVORITE_WORKOUTS,
          workouts,
        })
      })
  }

  useEffect(function componentDidMount() {
    setLoading(true)

    loadFavorites().then(() => setLoading(false))
  }, [])

  function navigateToWorkout(workout: Workout) {
    navigation.navigate('Workout', { id: workout.id, title: workout.title })
  }

  function remove(workoutId) {
    setLoading(true)

    callAuthenticatedWebservice(WorkoutServices.removeFromFavorites, { workoutId })
      .then(user => dispatch({
        type: ActionType.LOADED_USERDATA,
        user,
      }))
      .then(() => setLoading(false))
  }

  const keyExtractor = useCallback((workout, index) => `${workout.id}${index}`, [])
  const favoriteWorkoutIds = user.caseOf({
    just   : user => user.favoriteWorkouts,
    nothing: () => []
  })
  const renderItem = useCallback(({ item: workoutId, index }) => {
    const workout = workoutCatalog[workoutId]

    if (!workout) {
      return null
    }

    return (
      <MyWorkoutCard
        navigateToWorkout={navigateToWorkout}
        remove={remove}
        style={(favoriteWorkoutIds.length === 1 || index === favoriteWorkoutIds.length - 1) ? {} : {
          borderBottomWidth: 1,
          borderColor      : SummaxColors.darkGrey
        }}
        workout={workout}
      />
    )
  }, [])

  return isLoading ? (
    <Loading/>
  ) : user.caseOf({
    just   : ({ favoriteWorkouts }) => (
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

        <Layout style={[styles.mainPadding, { marginBottom: 17, marginTop: 45, }]}>
          <Text style={[styles.title, { marginBottom: 30 }]}>{i18n.t('My Workouts - To Do')}</Text>
          <Text style={styles.subtitle}>{i18n.t('My Workouts - Favorite workouts')} :</Text>
        </Layout>

        <Layout style={[styles.mainPadding, { paddingBottom: 150 }]}>
          {favoriteWorkouts.length === 0 ? (
            <Text style={[styles.workoutTitle, { marginTop: 16 }]}>{i18n.t('My Workouts - No favorite workout')}</Text>
          ) : (
            <FlatList
              data={favoriteWorkouts}
              keyExtractor={keyExtractor}
              removeClippedSubviews={true}
              renderItem={renderItem}
            />
          )}
        </Layout>
      </SafeAreaView>
    ),
    nothing: () => <ErrorPage/>
  })
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