import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { ScrollView, StatusBar, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Separator } from '../../components/separator'
import { Size as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { GlobalState } from '../../redux/store'
import { IntensityLevel } from '../../types'
import { FeaturedWorkout } from './featuredWorkout'
import { IntensityFilters } from './intensity-filters'
import { PopularWorkouts } from './popularWorkouts'
import { TargetFilters } from './target-filters'

export function Home() {
  const { firstname = '' } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))

  const featuredWorkout = {
    durationMin: 25,
    id         : '1',
    intensity  : IntensityLevel.MEDIUM,
    poster     : require('../../../assets/login_background.png'),
    subtitle   : 'Strengthening the muscles throughout a full HIIT workout!',
    title      : 'Full body workout'
  }

  const forYouWorkout = {
    ...featuredWorkout,
    id   : '2',
    title: 'Entraînement 1'
  }

  const thematicWorkouts = [{
    ...featuredWorkout,
    durationMin: 15,
    id         : '3',
    intensity  : IntensityLevel.HIGH,
    title      : 'Crossfit power',
  }, {
    ...featuredWorkout,
    durationMin: 15,
    id         : '4',
    intensity  : IntensityLevel.HIGH,
    title      : 'BodyBidule',
  }]

  const popularWorkouts = [{
    ...featuredWorkout,
    id   : '5',
    title: 'Triceps & dips',
  }, {
    ...featuredWorkout,
    id   : '6',
    title: 'Triceps & dips',
  }, {
    ...featuredWorkout,
    id   : '7',
    title: 'Triceps & dips',
  }]

  return (
    <ScrollView style={{ flex: 1, paddingVertical: 12, backgroundColor: 'white' }}>

      <StatusBar barStyle={'dark-content'}/>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Featured workout')}</Text>
      </Layout>

      <FeaturedWorkout onPress={() => {
      }} workout={featuredWorkout}/>

      <Separator style={styles.separator}/>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Selected for you', { firstname })}</Text>
      </Layout>

      <Layout style={{ padding: 16, marginBottom: 16 }}>
        <WorkoutCard workout={forYouWorkout} size={WorkoutCardSize.LARGE}/>
      </Layout>

      <Separator style={styles.separator}/>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Featured themes')}</Text>
      </Layout>

      <ScrollView style={{ padding: 16 }} horizontal={true}>
        {thematicWorkouts.map(workout => <WorkoutCard
          key={workout.id}
          workout={workout}
          style={{ marginRight: 16, marginBottom: 16 }}
          size={WorkoutCardSize.SMALL}/>)}
      </ScrollView>

      <PopularWorkouts workouts={popularWorkouts}/>

      <TargetFilters />

      <IntensityFilters />

      <Separator style={styles.separator}/>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Duration')}</Text>
      </Layout>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  title         : {
    color: 'black'
  },
  titleContainer: {
    padding: 16,
  },
  separator     : {
    paddingHorizontal: 16,
    marginBottom     : 16,
  },
})