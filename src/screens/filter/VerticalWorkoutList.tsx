import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Style as WorkoutCardStyle, WorkoutCard } from '../../components/workout-card'
import { Workout } from '../../types'
import { NoOp } from '../../utils'

interface Props {
  onPress?: (workout: Workout) => void
  onToggleFavorite?: (workout: Workout) => void
  workouts: Workout[]
}

export function VerticalWorkoutList({ onPress = NoOp, onToggleFavorite = NoOp, workouts }: Props) {
  return (
    <ScrollView style={styles.mainContainer}>
      {workouts.map(workout => (
        <WorkoutCard
          cardStyle={WorkoutCardStyle.WORKOUT_LARGE}
          key={workout.id}
          onPress={() => onPress(workout)}
          onToggleFavorite={() => onToggleFavorite(workout)}
          style={styles.workoutCard}
          themeOrWorkout={workout}
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  workoutCard  : {
    marginBottom: 16,
  },
})