import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { Separator } from '../../components/separator'
import { Style as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { Workout } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutServices from '../../webservices/workouts'

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Filter'>
}

export function FilterScreen({}: Props) {
  const route = useRoute<RouteProp<RootStackParamList, 'Filter'>>()
  const { type: filterType, value: filterValue, subfilter, title } = route.params
  const [isLoading, setIsLoading] = useState(true)
  const [workouts, setWorkouts] = useState(Maybe.nothing<Workout[]>())
  const navigation = useNavigation()

  useEffect(function componentDidMount() {

    navigation.setOptions({ headerTitle: title })

    callAuthenticatedWebservice(WorkoutServices.loadFavorites, {})
      .then((workouts: Maybe<Workout[]>) => {
        setWorkouts(workouts)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loading/>
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {workouts.caseOf({
        just   : workouts => (
          <ScrollView style={styles.mainContainer}>

            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>Haut du corps</Text>
            </Layout>

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.workoutList}>
              {workouts.map(workout => (
                <WorkoutCard
                  key={workout.id}
                  themeOrWorkout={workout}
                  cardStyle={WorkoutCardSize.WORKOUT_SMALL}
                />
              ))}
            </ScrollView>

            <Separator style={styles.separator}/>
          </ScrollView>
        ),
        nothing: () => <ErrorPage/>
      })}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer : {
    backgroundColor  : 'white',
    flex             : 1,
    paddingBottom    : 35,
    paddingHorizontal: 16,
    paddingTop       : 12,
  },
  titleContainer: {
    justifyContent: 'center',
    height        : 56,
  },
  title         : {
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 27
  },
  workoutList   : {
    flex        : undefined,
    height      : 160,
    marginBottom: 15,
    marginTop   : 19,
  },
  separator     : {
    marginVertical: 18
  },
})