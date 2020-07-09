import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Style as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { Workout } from '../../types'
import { NoOp } from '../../utils'

interface Props {
  onPress?: (workout: Workout) => void
  onToggleFavorite?: (workout: Workout) => void
  title: string
  workouts: Workout[]
}

export function HorizontalWorkoutList({ onPress = NoOp, onToggleFavorite = NoOp, title, workouts }: Props) {
  return (
    <Layout>
      <Layout style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </Layout>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.workoutList}>
        {workouts.map(workout => (
          <WorkoutCard
            cardStyle={WorkoutCardSize.WORKOUT_SMALL}
            key={workout.id}
            onPress={() => onPress(workout)}
            onToggleFavorite={() => onToggleFavorite(workout)}
            style={styles.workoutCard}
            themeOrWorkout={workout}
          />
        ))}
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
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
    height      : 160,
    marginBottom: 15,
    marginTop   : 19,
  },
  workoutCard: {
    marginRight: 16,
  },
})