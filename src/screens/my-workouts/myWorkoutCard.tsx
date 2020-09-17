import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { Workout } from '../../types'
import { NoOp } from '../../utils'

interface Props {
  navigateToWorkout?: (workout: Workout) => void
  remove?: (workoutId: string) => void
  style?: ViewStyle
  workout: Workout
}

const minusCircleIcon = require('./minus-circle.png')

export function MyWorkoutCard({ navigateToWorkout = NoOp, remove = NoOp, style = {}, workout }: Props) {
  return (
    <Layout
      key={workout.id}
      style={[styles.workoutContainer, style]}
    >

      <TouchableOpacity activeOpacity={.8} onPress={() => navigateToWorkout(workout)}>
        <Image source={{ uri: workout.posterUrl }} style={styles.workoutImage}/>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={.8}
        style={styles.workoutTitleContainer}
        onPress={() => navigateToWorkout(workout)}
      >
        <Layout style={styles.workoutTitleContainer}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
        </Layout>
      </TouchableOpacity>

      <Layout style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={.8} onPress={() => remove(workout.id)}>
          <Image source={minusCircleIcon} style={styles.buttonImage}/>
        </TouchableOpacity>
      </Layout>

    </Layout>
  )
}

const styles = StyleSheet.create({
  workoutContainer     : {
    flexDirection  : 'row',
    paddingVertical: 16,
  },
  workoutImage         : {
    borderRadius: 5,
    height      : 74,
    width       : 131,
  },
  workoutTitleContainer: {
    flex             : 1,
    justifyContent   : 'center',
    paddingHorizontal: 13,
  },
  workoutTitle         : {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 24,
  },
  buttonContainer      : {
    justifyContent: 'center',
  },
  buttonImage          : {
    height: 20,
    width : 20,
  }
})