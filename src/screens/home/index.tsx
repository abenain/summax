import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { ScrollView, StatusBar, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Separator } from '../../components/separator'
import { GlobalState } from '../../redux/store'
import { IntensityLevel } from '../../types'
import { FeaturedWorkout } from './FeaturedWorkout'

export function Home() {
  const { firstname = '' } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))
  const workout = {
    durationMin: 25,
    intensity  : IntensityLevel.MEDIUM,
    poster     : require('../../../assets/login_background.png'),
    subtitle   : 'Strengthening the muscles throughout a full HIIT workout!',
    title      : 'Full body workout'
  }

  return (
    <ScrollView style={{ flex: 1, paddingVertical: 12, backgroundColor: 'white' }}>

      <StatusBar barStyle={'dark-content'}/>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Featured workout')}</Text>
      </Layout>

      <FeaturedWorkout onPress={() => {}} workout={workout}/>

      <Separator style={styles.separator}/>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Selected for you', { firstname })}</Text>
      </Layout>

      <Separator style={styles.separator}/>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Featured themes')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Popular workouts')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Target')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h3' style={styles.title}>{i18n.t('Home - Intensity')}</Text>
      </Layout>

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
  separator: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
})