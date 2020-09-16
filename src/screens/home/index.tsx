import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { EVENTS } from '../../amplitude'
import { DurationFilters } from '../../components/duration-filters'
import { IntensityFilters } from '../../components/intensity-filters'
import { Separator } from '../../components/separator'
import { TargetFilters } from '../../components/target-filters'
import { Style as WorkoutCardSize, WorkoutCard } from '../../components/workout-card'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { Target, Workout } from '../../types'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutService from '../../webservices/workouts'
import { FeaturedWorkout } from './featuredWorkout'
import { PopularWorkouts } from './popularWorkouts'

export function HomeScreen() {
  const { firstname = '' } = useSelector(({ userData: { user } }: GlobalState) => user.valueOr({} as any))
  const { homepage, workoutCatalog } = useSelector(({ contents: { homepage, workoutCatalog } }: GlobalState) => ({
    homepage,
    workoutCatalog
  }))
  const navigation = useNavigation()
  const dispatch = useDispatch()

  useEffect(function componentDidMount() {
    Amplitude.logEvent(EVENTS.SHOWED_HOME_PAGE)
  }, [])

  function navigateToWorkout(workout: Workout) {
    navigation.navigate('Workout', { id: workout.id, title: workout.title })
  }

  function navigateToFilterScreen(filterValues: { subfilter?: string, title?: string, type: string, value: string | number }) {
    navigation.navigate('Filter', filterValues)
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

      <StatusBar barStyle={'dark-content'} backgroundColor={'black'}/>

      {homepage.caseOf({
        just   : homepage => (
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Featured workout')}</Text>
            </Layout>

            <FeaturedWorkout
              workout={{
                ...workoutCatalog[homepage.featuredWorkout.id],
                posterUrl: homepage.featuredWorkout.posterUrl
              }}
              onPress={() => navigateToWorkout(workoutCatalog[homepage.featuredWorkout.id])}/>

            <Separator style={styles.separator}/>

            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{i18n.t('Home - Selected for you', { firstname })}</Text>
            </Layout>

            <Layout style={{ paddingHorizontal: 16, marginBottom: 32 }}>
              <WorkoutCard
                themeOrWorkout={workoutCatalog[homepage.selectedForYou.id]}
                cardStyle={WorkoutCardSize.WORKOUT_LARGE}
                onPress={() => navigateToWorkout(workoutCatalog[homepage.selectedForYou.id])}
                onToggleFavorite={(favorite: boolean) => {
                  /*dispatch({
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
                    }))*/
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
                onPress={() => navigateToFilterScreen({
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
              workouts={homepage.popularWorkouts.map(({id}: {id: string}) => workoutCatalog[id])}
              onPress={navigateToWorkout}
              onToggleFavorite={(workoutId: string, favorite: boolean) => {
                /*dispatch({
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
                  }))*/
              }}/>

            <TargetFilters onFilter={(target: Target) => navigateToFilterScreen({
              subfilter: 'duration',
              type     : 'target',
              value    : target,
            })}/>

            <IntensityFilters onFilter={intensity => navigateToFilterScreen({
              subfilter: 'duration',
              type     : 'intensity',
              value    : intensity,
            })}/>

            <Separator style={{ ...styles.separator, marginBottom: 0 }}/>

            <DurationFilters onFilter={duration => navigateToFilterScreen({
              subfilter: 'intensity',
              type     : 'duration',
              value    : duration,
            })}/>
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