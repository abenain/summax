import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
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
  const route = useRoute<RouteProp<RootStackParamList, 'Filter'>>()
  const { subfilter, title, type: filterType, value: filterValue } = route.params
  const [isLoading, setIsLoading] = useState(true)
  const [workouts, setWorkouts] = useState(Maybe.nothing<Workout[]>())
  const navigation = useNavigation()

  const loadWorkouts = useCallback(() => {
    return callAuthenticatedWebservice(WorkoutServices.fetchWorkouts, {
      filter: {
        type : filterType,
        value: filterValue
      }
    })
      .then((workouts: Maybe<Workout[]>) => {
        setWorkouts(workouts)
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
    const webservice = workout.favorite ? WorkoutService.removeFromFavorites : WorkoutService.addToFavorites

    return callAuthenticatedWebservice(webservice, { workoutId: workout.id })
      .then(() => {
        const updatedWorkouts = workouts.map(workouts => workouts.map(workoutInState => {
          if (workoutInState.id !== workout.id) {
            return workoutInState
          }

          return {
            ...workoutInState,
            favorite: !workoutInState.favorite
          }
        }))

        setWorkouts(updatedWorkouts)
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {workouts.caseOf({
        just   : workouts => {
          if (!workouts.length) {
            return <ErrorPage message={i18n.t('Filter - No Workout in this category')}/>
          }

          return Boolean(subfilter) ? (
            <ScrollView style={styles.mainContainer}>
              <WorkoutListWithSubfilter
                onPress={navigateToWorkout}
                onToggleFavorite={toggleFavorite}
                subfilter={subfilter}
                workouts={workouts}
              />
            </ScrollView>
          ) : (
            <Layout style={styles.mainContainer}>
              <VerticalWorkoutList
                onPress={navigateToWorkout}
                onToggleFavorite={toggleFavorite}
                workouts={workouts}
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