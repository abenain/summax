import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { Duration, Size as DurationSize } from '../../components/duration'
import { ErrorPage } from '../../components/ErrorPage'
import { IconMode as IntensityIconMode, Intensity, Size as IntensitySize } from '../../components/intensity'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { targetToString } from '../../components/target-filters'
import { Workout } from '../../types'
import { load } from '../../webservices/workouts'

const backgroundImage = require('../../../assets/login_background.png')
const plusIcon = require('./plus.png')

export function WorkoutScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Workout'>>()
  const navigation = useNavigation()
  const { id: workoutId } = route.params
  const [isLoading, setIsLoading] = useState(true)
  const [workout, setWorkout] = useState(Maybe.nothing<Workout>())
  useEffect(function componentDidMount() {
    load(workoutId)
      .then((workout: Maybe<Workout>) => {
        setWorkout(workout)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loading/>
  }

  return workout.caseOf({
    just   : workout => (
      <View style={{ flex: 1, width: '100%' }}>
        <StatusBar barStyle={'light-content'} translucent={true}/>

        <Image source={backgroundImage} style={styles.backgroundImage}/>

        <LinearGradient colors={['rgba(1,1,17,0)', 'rgba(0,0,0,1)', 'rgb(0,0,0)']}
                        start={[.5, 0]}
                        end={[.5, 1]}
                        style={styles.colorGradient}
                        locations={[0, .53, 1]}/>

        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <Layout style={styles.contents}>

              <Layout style={styles.titleContainer}>
                <Text style={styles.title}>{workout.title}</Text>
              </Layout>

              <Layout style={styles.favoritesContainer}>
                <Image source={plusIcon} style={styles.favoritesIcon}/>
                <Text style={styles.favoritesText}>{i18n.t('Workout Description - Add to Favorites')}</Text>
              </Layout>

              <Layout style={styles.workoutFeatures}>

                <Layout style={styles.workoutFeaturesSplitContainer}>
                  <Layout style={styles.workoutFeaturesSplitLeftContainer}>
                    <Text style={styles.workoutFeaturesText}>{workout.techniques.join(' ')}</Text>
                  </Layout>
                  <Layout style={styles.workoutFeaturesSplitRightContainer}>
                    <Text style={styles.workoutFeaturesText}>{targetToString(workout.target)}</Text>
                  </Layout>
                </Layout>

                <Text style={styles.workoutFeaturesDetails}>{workout.details}</Text>

                <Layout style={styles.workoutFeaturesSplitContainer}>
                  <Layout style={styles.workoutFeaturesSplitLeftContainer}>
                    <Intensity
                      iconMode={IntensityIconMode.MULTIPLE}
                      size={IntensitySize.SMALL}
                      level={workout.intensity}
                      textColor={'black'}/>
                  </Layout>
                  <Layout style={styles.workoutFeaturesSplitRightContainer}>
                    <Duration
                      iconMode={IntensityIconMode.MULTIPLE}
                      size={DurationSize.SMALL}
                      durationMin={workout.durationMin}
                      textColor={'black'}/>
                  </Layout>
                </Layout>

              </Layout>

            </Layout>
          </ScrollView>

          <Layout style={styles.buttonContainer}>
            <SummaxButton
              buttonStyle={ButtonStyle.BLACK}
              text={i18n.t('Workout Description - Warm up')}
            />
            <SummaxButton
              buttonStyle={ButtonStyle.GREEN}
              onPress={() => navigation.navigate('Training')}
              text={i18n.t('Workout Description - Workout')}
            />
          </Layout>
        </SafeAreaView>
      </View>
    ),
    nothing: () => <ErrorPage/>
  })
}

const styles = StyleSheet.create({
  backgroundImage                   : {
    width     : '100%',
    height    : 750,
    resizeMode: 'stretch',
    position  : 'absolute',
  },
  colorGradient                     : {
    position: 'absolute',
    top     : 0,
    bottom  : 0,
    left    : 0,
    right   : 0,
  },
  contents                          : {
    flex             : 1,
    backgroundColor  : 'transparent',
    paddingTop       : 56,
    paddingHorizontal: 16,
  },
  titleContainer                    : {
    marginTop      : 100,
    backgroundColor: 'transparent'
  },
  title                             : {
    color     : 'white',
    fontFamily: 'nexaHeavy',
    fontSize  : 30,
    lineHeight: 40,
  },
  favoritesContainer                : {
    alignSelf      : 'stretch',
    alignItems     : 'center',
    backgroundColor: 'transparent',
    flexDirection  : 'row',
    marginTop      : 20,
  },
  favoritesIcon                     : {
    height     : 20,
    marginRight: 20,
    width      : 20,
  },
  favoritesText                     : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 24,
  },
  workoutFeatures                   : {
    alignSelf        : 'stretch',
    backgroundColor  : 'white',
    borderRadius     : 5,
    marginTop        : 30,
    paddingHorizontal: 16,
    paddingVertical  : 33,
  },
  workoutFeaturesSplitContainer     : {
    alignItems   : 'center',
    flexDirection: 'row',
  },
  workoutFeaturesSplitLeftContainer : {
    alignItems      : 'center',
    borderColor     : SummaxColors.lightGrey,
    borderRightWidth: 1,
    flex            : 1,
  },
  workoutFeaturesSplitRightContainer: {
    alignItems: 'center',
    flex      : 1,
  },
  workoutFeaturesText               : {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 24,
  },
  workoutFeaturesDetails            : {
    fontFamily    : 'nexaRegular',
    fontSize      : 14,
    lineHeight    : 20,
    marginVertical: 16,
  },
  buttonContainer                   : {
    alignItems       : 'center',
    justifyContent   : 'space-between',
    backgroundColor  : 'black',
    flexDirection    : 'row',
    paddingHorizontal: 16,
    paddingTop       : 30,
  },
})