import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { Separator } from '../../components/separator'
import { Style as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { HomePageWorkout, Target } from '../../types'
import { DurationFilters } from '../../components/duration-filters'
import { callAuthenticatedWebservice } from '../../webservices'
import { FeaturedWorkout } from './featuredWorkout'
import { IntensityFilters } from '../../components/intensity-filters'
import { PopularWorkouts } from './popularWorkouts'
import { TargetFilters } from '../../components/target-filters'
import * as WorkoutService from '../../webservices/workouts'
import { useDispatch } from 'react-redux'

export function HomeScreen() {
  const { firstname = '' } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))
  const homepage = useSelector(({ contents: { homepage } }: GlobalState) => homepage)
  const navigation = useNavigation()
  const dispatch = useDispatch()

  function navigateToWorkout(workout: HomePageWorkout) {
    navigation.navigate('Workout', { id: workout.id, title: workout.title })
  }

  function toggleFavorite(workoutId: string, favorite: boolean) {
    const webservice = favorite ? WorkoutService.addToFavorites : WorkoutService.removeFromFavorites

    return callAuthenticatedWebservice(webservice, { workoutId })
      .then(user => {
        dispatch({
          type: ActionType.LOADED_USERDATA,
          user,
        })
        return user
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <StatusBar barStyle={'light-content'} backgroundColor={'black'}/>

      {homepage.caseOf({
        just   : homepage => (
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Featured workout')}</Text>
            </Layout>

            <FeaturedWorkout workout={homepage.featuredWorkout}
                             onPress={() => navigateToWorkout(homepage.featuredWorkout)}/>

            <Separator style={styles.separator}/>

            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Selected for you', { firstname })}</Text>
            </Layout>

            <Layout style={{ paddingHorizontal: 16, marginBottom: 32 }}>
              <WorkoutCard
                themeOrWorkout={homepage.selectedForYou}
                cardStyle={WorkoutCardSize.WORKOUT_LARGE}
                onPress={() => navigateToWorkout(homepage.selectedForYou)}
                onToggleFavorite={(favorite: boolean) => {
                  dispatch({
                    type    : ActionType.UPDATED_HOMEPAGE,
                    homepage: Maybe.just({
                      ...homepage,
                      selectedForYou: {
                        ...homepage.selectedForYou,
                        favorite
                      }
                    })
                  })
                  toggleFavorite(homepage.selectedForYou.id, favorite)
                    .then(user => user.caseOf({
                      just   : () => {
                      },
                      nothing: () => {
                        dispatch({
                          type    : ActionType.UPDATED_HOMEPAGE,
                          homepage: Maybe.just({
                            ...homepage,
                            selectedForYou: {
                              ...homepage.selectedForYou,
                              favorite: !favorite
                            }
                          })
                        })
                      }
                    }))
                }}/>
            </Layout>

            <Separator style={styles.separator}/>

            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Featured themes')}</Text>
            </Layout>

            <ScrollView style={{ paddingHorizontal: 16, marginBottom: 16 }} horizontal={true}
                        showsHorizontalScrollIndicator={false}>
              {homepage.themes.map(theme => <WorkoutCard
                key={theme.title}
                onPress={() => navigation.navigate('Filter', {
                  title: theme.title,
                  type : 'id',
                  value: theme.workoutIds.join(','),
                })}
                themeOrWorkout={theme}
                style={{ marginRight: 16, marginBottom: 16 }}
                cardStyle={WorkoutCardSize.THEME}/>)}
              <Layout style={{ width: 16 }}/>
            </ScrollView>

            <PopularWorkouts
              workouts={homepage.popularWorkouts}
              onPress={navigateToWorkout}
              onToggleFavorite={(workoutId: string, favorite: boolean) => {
                dispatch({
                  type    : ActionType.UPDATED_HOMEPAGE,
                  homepage: Maybe.just({
                    ...homepage,
                    popularWorkouts: homepage.popularWorkouts.map(workout => ({
                      ...workout,
                      favorite: workout.id === workoutId ? favorite : workout.favorite
                    }))
                  })
                })
                toggleFavorite(workoutId, favorite)
                  .then(user => user.caseOf({
                    just   : () => {
                    },
                    nothing: () => {
                      dispatch({
                        type    : ActionType.UPDATED_HOMEPAGE,
                        homepage: Maybe.just({
                          ...homepage,
                          popularWorkouts: homepage.popularWorkouts.map(workout => ({
                            ...workout,
                            favorite: workout.id === workoutId ? !favorite : workout.favorite
                          }))
                        })
                      })
                    }
                  }))
              }}/>

            <TargetFilters onFilter={(target: Target) => navigation.navigate('Filter', {
              title    : 'Haut du corps',
              type     : 'target',
              value    : target,
              subfilter: 'duration',
            })}/>

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