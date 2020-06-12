import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Separator } from '../../components/separator'
import { Size as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { GlobalState } from '../../redux/store'
import { DurationFilters } from './duration-filters'
import { FeaturedWorkout } from './featuredWorkout'
import { IntensityFilters } from './intensity-filters'
import { PopularWorkouts } from './popularWorkouts'
import { TargetFilters } from './target-filters'

export function Home() {
  const { firstname = '' } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))
  const homepage = useSelector(({ contents: { homepage } }: GlobalState) => homepage)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <StatusBar barStyle={'dark-content'}/>

      {homepage.caseOf({
        just   : homepage => (
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Featured workout')}</Text>
            </Layout>

            <FeaturedWorkout workout={homepage.featuredWorkout}/>

            <Separator style={styles.separator}/>

            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Selected for you', { firstname })}</Text>
            </Layout>

            <Layout style={{ paddingHorizontal: 16, marginBottom: 32 }}>
              <WorkoutCard workout={homepage.selectedForYou} size={WorkoutCardSize.LARGE}/>
            </Layout>

            <Separator style={styles.separator}/>

            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Featured themes')}</Text>
            </Layout>

            <ScrollView style={{ paddingHorizontal: 16, marginBottom: 16 }} horizontal={true}>
              {homepage.thematicWorkouts.map(workout => <WorkoutCard
                key={workout.id}
                workout={workout}
                style={{ marginRight: 16, marginBottom: 16 }}
                size={WorkoutCardSize.SMALL}/>)}
            </ScrollView>

            <PopularWorkouts workouts={homepage.popularWorkouts}/>

            <TargetFilters/>

            <IntensityFilters/>

            <Separator style={{ ...styles.separator, marginBottom: 0 }}/>

            <DurationFilters/>
          </ScrollView>
        ),
        nothing: () => (
          <Layout style={styles.noContentsContainer}>
            <Text style={styles.title}>{i18n.t('Home - No content available')}</Text>
          </Layout>
        )
      })}

    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  title              : {
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    color     : 'black'
  },
  titleContainer     : {
    marginVertical   : 16,
    paddingHorizontal: 16,
    height           : 56,
    justifyContent   : 'center',
  },
  separator          : {
    paddingHorizontal: 16,
  },
  noContentsContainer: {
    flex             : 1,
    justifyContent   : 'center',
    alignItems       : 'center',
    paddingHorizontal: 24,
    backgroundColor  : 'transparent',
  },
})