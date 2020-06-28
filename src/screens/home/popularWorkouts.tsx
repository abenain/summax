import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Size as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { HomePageWorkout } from '../../types'

const x = require('./x.png')

interface Props {
  workouts: HomePageWorkout[]
}

export function PopularWorkouts({ workouts }: Props) {
  const limitedWorkouts = workouts.slice(0, 3)
  return (
    <Layout style={styles.container}>

      <Image source={x} style={styles.xIcon}/>

      <Text style={styles.title}>{i18n.t('Home - Popular workouts')}</Text>

      {limitedWorkouts.map((workout, index, allWorkouts) => <WorkoutCard
        key={workout.id}
        workout={workout}
        style={{ marginBottom: index < allWorkouts.length - 1 ? 40 : 0 }}
        size={WorkoutCardSize.LARGE}/>)}
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