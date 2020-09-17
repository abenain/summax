import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { Workout } from '../../types'
import { NoOp } from '../../utils'

interface Props {
  completionRatio: number
  style?: ViewStyle
  workout: Workout
}

export function UnfinishedWorkoutCard({ style = {}, workout }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={.8}
      onPress={NoOp}
      style={[styles.workoutContainer, style]}
    >
      <Image source={{ uri: workout.posterUrl }} style={styles.workoutImage}/>

      <Layout style={styles.workoutTitleContainer}>
        <Text style={styles.workoutTitle}>{workout.title}</Text>
      </Layout>
    </TouchableOpacity>
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
})