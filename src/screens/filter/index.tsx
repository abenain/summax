import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { getTitleForDuration } from '../../components/duration-filters'
import { ErrorPage } from '../../components/ErrorPage'
import { getTitleForIntensity } from '../../components/intensity-filters'
import { Loading } from '../../components/Loading'
import { Separator } from '../../components/separator'
import { getTitleForTarget } from '../../components/target-filters'
import { IntensityLevel, Target, Workout, WorkoutDuration } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutService from '../../webservices/workouts'
import * as WorkoutServices from '../../webservices/workouts'
import { HorizontalWorkoutList } from './HorizontalWorkoutList'
import { VerticalWorkoutList } from './VerticalWorkoutList'

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Filter'>
}

function getTitleForFilter(filterType: string, filterValue: string | number) {
  switch (filterType) {
    case 'duration':
      return getTitleForDuration(filterValue as WorkoutDuration)
    case 'intensity':
      return getTitleForIntensity(filterValue as IntensityLevel)
    case 'target':
      return getTitleForTarget(filterValue as Target)
    default:
      return ''
  }
}

export function FilterScreen({}: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'Filter'>>()
  const { subfilter, title, type: filterType, value: filterValue } = route.params
  const [isLoading, setIsLoading] = useState(true)
  const [workouts, setWorkouts] = useState(Maybe.nothing<Workout[]>())
  const navigation = useNavigation()

  function loadWorkouts() {
    return callAuthenticatedWebservice(WorkoutServices.fetchWorkouts, {
      filter: {
        type : filterType,
        value: filterValue
      }
    })
      .then((workouts: Maybe<Workout[]>) => {
        setWorkouts(workouts)
      })
  }

  useEffect(function componentDidMount() {

    navigation.setOptions({ headerTitle: title || getTitleForFilter(filterType, filterValue) })

    loadWorkouts().then(() => setIsLoading(false))
  }, [])

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
    <SafeAreaView style={{ flex: 1 }}>
      {workouts.caseOf({
        just   : workouts => {
          if (!workouts.length) {
            return <ErrorPage message={i18n.t('Filter - No Workout in this category')}/>
          }

          return Boolean(subfilter) ? (
            <ScrollView style={styles.mainContainer}>
              <HorizontalWorkoutList title={'Ho du kor'} workouts={workouts}/>
              <Separator style={styles.separator}/>
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
  separator    : {
    marginVertical: 18
  },
})