import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { Workout } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutService from '../../webservices/workouts'
import * as WorkoutServices from '../../webservices/workouts'
import { getTitleForFilter } from './utils'
import { VerticalWorkoutList } from './VerticalWorkoutList'
import { WorkoutListWithSubfilter } from './WorkoutListWithSubfilter'

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Filter'>
}

export function FilterScreen({}: Props) {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, 'Filter'>>()
  const { subfilter, title, type: filterType, value: filterValue } = route.params
  const [isLoading, setIsLoading] = useState(true)
  const [workoutIds, setWorkoutIds] = useState(Maybe.nothing<string[]>())
  const workoutCatalog = useSelector(({ contents: { workoutCatalog } }: GlobalState) => workoutCatalog)

  const loadWorkouts = useCallback(() => {
    return callAuthenticatedWebservice(WorkoutServices.fetchWorkouts, {
      filter: {
        type : filterType,
        value: filterValue
      }
    }).then((workouts: Maybe<Workout[]>) => {
        setWorkoutIds(workouts.map(workouts => workouts.map(workout => workout.id)))
        dispatch({
          type: ActionType.UPDATE_WORKOUT_CATALOG,
          workouts
        })
      })
  }, [filterType, filterValue])

  const updateTitle = useCallback(() => {
    navigation.setOptions({ headerTitle: title || getTitleForFilter(filterType, filterValue) })
  }, [title, filterType, filterValue])

  useFocusEffect(useCallback(() => {
    setIsLoading(true)
    updateTitle()
    loadWorkouts().then(() => setIsLoading(false))
  }, [title, filterType, filterValue]))

  if (isLoading) {
    return <Loading/>
  }

  function navigateToWorkout(workout: Workout) {
    navigation.navigate('Workout', {
      id   : workout.id,
      title: workout.title,
    })
  }

  function toggleFavorite(workout: Workout) {
    const setFavorite = workout.favorite === false
    const webservice = setFavorite ? WorkoutService.addToFavorites : WorkoutService.removeFromFavorites

    dispatch({
      favorite : setFavorite,
      type     : ActionType.SET_WORKOUT_FAVORITE_STATUS,
      workoutId: workout.id,
    })

    callAuthenticatedWebservice(webservice, { workoutId: workout.id })
      .then(user => {
        user.caseOf({
          just   : () => {
            dispatch({
              type: ActionType.LOADED_USERDATA,
              user,
            })
          },
          nothing: () => {
            dispatch({
              favorite : !setFavorite,
              type     : ActionType.SET_WORKOUT_FAVORITE_STATUS,
              workoutId: workout.id,
            })
          }
        })
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {workoutIds.caseOf({
        just   : workoutIds => {
          if (!workoutIds.length) {
            return <ErrorPage message={i18n.t('Filter - No Workout in this category')}/>
          }

          return Boolean(subfilter) ? (
            <ScrollView style={styles.mainContainer}>
              <WorkoutListWithSubfilter
                onPress={navigateToWorkout}
                onToggleFavorite={toggleFavorite}
                subfilter={subfilter}
                workouts={workoutIds.map(workoutId => workoutCatalog[workoutId])}
              />
            </ScrollView>
          ) : (
            <Layout style={styles.mainContainer}>
              <VerticalWorkoutList
                onPress={navigateToWorkout}
                onToggleFavorite={toggleFavorite}
                workouts={workoutIds.map(workoutId => workoutCatalog[workoutId])}
              />
            </Layout>
          )
        },
        nothing: () => <ErrorPage/>
      })}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor  : 'white',
    flex             : 1,
    paddingBottom    : 35,
    paddingHorizontal: 16,
    paddingTop       : 12,
  },
})