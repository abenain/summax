import { Layout } from '@ui-kitten/components'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { durationFrom } from '../../components/duration-filters'
import { Separator } from '../../components/separator'
import { Workout } from '../../types'
import { NoOp } from '../../utils'
import { HorizontalWorkoutList } from './HorizontalWorkoutList'
import { getTitleForFilter } from './utils'

interface Props {
  onPress?: (workout: Workout) => void
  onToggleFavorite?: (workout: Workout) => void
  subfilter: string
  workouts: Workout[]
}

export function WorkoutListWithSubfilter({ onPress = NoOp, onToggleFavorite = NoOp, subfilter, workouts }: Props) {
  const workoutMap = workouts.reduce((accumulator, workout) => {
    const workoutSubfilterValue = subfilter === 'duration' ? durationFrom(workout.durationMin) : workout[subfilter]

    return {
      ...accumulator,
      [workoutSubfilterValue]: (accumulator[workoutSubfilterValue] || []).concat([workout])
    }
  }, {})

  return (
    <>
      {Object.keys(workoutMap).map((key, index, allKeys) => {
        return (
          <>
            <HorizontalWorkoutList
              key={`list-${key}`}
              onPress={onPress}
              onToggleFavorite={onToggleFavorite}
              title={getTitleForFilter(subfilter, key)}
              workouts={workoutMap[key]}
            />
            {(index < allKeys.length - 1) ? (
              <Separator key={`separator-${index}`} style={styles.separator}/>
            ) : (
              <Layout key={`spacer-${index}`} style={{backgroundColor: 'transparent', height: 32}}/>
            )}
          </>
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 18
  },
})