import { RouteProp, useRoute } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { LinearGradient } from 'expo-linear-gradient'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { load } from '../../webservices/workouts'
import {Workout} from '../../types'

const backgroundImage = require('../../../assets/login_background.png')

export function WorkoutScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Workout'>>()
  const {id: workoutId} = route.params
  const [isLoading, setIsLoading] = useState(true)
  const [workout, setWorkout] = useState(Maybe.nothing<Workout>())

  useEffect(function componentDidMount(){
    load(workoutId)
      .then((workout: Maybe<Workout>) => {
        setWorkout(workout)
        setIsLoading(false)
      })
  }, [])

  if(isLoading){
    return <Loading />
  }

  return workout.caseOf({
    just: workout => (
      <View style={{ flex: 1, width: '100%' }}>
        <StatusBar barStyle={'light-content'} translucent={true}/>

        <Image source={backgroundImage} style={styles.backgroundImage}/>

        <LinearGradient colors={['rgba(1,1,17,0)', 'rgba(0,0,0,1)', 'rgb(0,0,0)']}
                        start={[.5, 0]}
                        end={[.5, 1]}
                        style={styles.colorGradient}
                        locations={[0, .53, 1]}/>

        <SafeAreaView style={{ flex: 1 }}>

          <Layout style={styles.contents}>

            <Layout style={styles.titleContainer}>
              <Text style={styles.title}>{workout.title}</Text>
            </Layout>

          </Layout>
        </SafeAreaView>
      </View>
    ),
    nothing: () => <ErrorPage />
  })
}

const styles = StyleSheet.create({
  backgroundImage: {
    width     : '100%',
    height    : 750,
    resizeMode: 'stretch',
    position  : 'absolute',
  },
  colorGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contents      : {
    flex           : 1,
    backgroundColor: 'transparent',
    paddingTop     : 56,
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginTop: 100,
    backgroundColor: 'transparent'
  },
  title: {
    color: 'white',
    fontFamily: 'nexaHeavy',
    fontSize: 30,
    lineHeight: 40,
  }
})