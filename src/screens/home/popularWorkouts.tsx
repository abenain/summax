import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Style as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { Workout } from '../../types'
import { NoOp } from '../../utils'

const x = require('./x.png')

interface Props {
  onPress?: (workout: Workout) => void
  onToggleFavorite: (workoutId: string, favorite: boolean) => void
  workouts: Workout[]
}

export function PopularWorkouts({ onPress = NoOp, onToggleFavorite, workouts }: Props) {
  const limitedWorkouts = workouts.slice(0, 3)
  return (
    <Layout style={styles.container}>

      <Image source={x} style={styles.xIcon}/>

      <Text style={styles.title}>{i18n.t('Home - Popular workouts')}</Text>

      {limitedWorkouts.map((workout, index, allWorkouts) => <WorkoutCard
        key={workout.id}
        cardStyle={WorkoutCardSize.WORKOUT_LARGE}
        onPress={() => onPress(workout)}
        onToggleFavorite={(favorite: boolean) => onToggleFavorite(workout.id, favorite)}
        style={{ marginBottom: index < allWorkouts.length - 1 ? 40 : 0 }}
        themeOrWorkout={workout}
        />)}
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor  : 'black',
    paddingHorizontal: 16,
    paddingTop       : 32,
    paddingBottom    : 40,
    alignItems       : 'center'
  },
  xIcon    : {
    width       : 50,
    height      : 49,
    marginBottom: 24
  },
  title    : {
    color       : 'white',
    marginBottom: 32,
    fontFamily  : 'aktivGroteskXBold',
    fontSize    : 30,
  },
})