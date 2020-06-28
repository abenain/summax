import { Layout, Text } from '@ui-kitten/components'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import i18n from 'i18n-js'
import { SummaxColors } from '../../colors'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutServices from '../../webservices/workouts'
import { useDispatch, useSelector } from 'react-redux'

const minusCircleIcon = require('./minus-circle.png')

export function MyWorkoutsScreen() {
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const favoriteWorkouts = useSelector(({ contents: { favoriteWorkouts } }: GlobalState) => favoriteWorkouts)

  function loadFavorites(){
    return callAuthenticatedWebservice(WorkoutServices.loadFavorites)
      .then(workouts => {
        dispatch({
          type: ActionType.LOADED_FAVORITE_WORKOUTS,
          workouts,
        })
      })
  }

  useEffect(function componentDidMount() {
    setLoading(true)

    loadFavorites().then(() => setLoading(false))
  }, [])

  function remove(workoutId){
    setLoading(true)

    callAuthenticatedWebservice(WorkoutServices.removeFromFavorites, {workoutId})
      .then(loadFavorites)
      .then(() => setLoading(false))
  }

  return isLoading ? (
    <Loading/>
  ) : favoriteWorkouts.caseOf({
    just   : workouts => (
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

        <Layout style={[styles.mainPadding, { marginBottom: 17, marginTop: 30, }]}>
          <Text style={[styles.title, { marginBottom: 30 }]}>{i18n.t('My Workouts - To Do')}</Text>
          <Text style={styles.subtitle}>{i18n.t('My Workouts - Favorite workouts')} :</Text>
        </Layout>

        <Layout style={[styles.mainPadding]}>
          {workouts.length === 0 ? (
            <Text style={[styles.workoutTitle, {marginTop: 16}]}>{i18n.t('My Workouts - No favorite workout')}</Text>
          ) : (
            workouts.map((workout, index, allWorkouts) => (
              <Layout style={[styles.workoutContainer, (allWorkouts.length === 1 || index === allWorkouts.length - 1) ? {} : {borderBottomWidth: 1, borderColor: SummaxColors.darkGrey}]}>

                <Image source={{ uri: workout.posterUrl }} style={styles.workoutImage}/>

                <Layout style={styles.workoutTitleContainer}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                </Layout>

                <Layout style={styles.buttonContainer}>
                  <TouchableOpacity activeOpacity={.8} onPress={() => remove(workout.id)}>
                    <Image source={minusCircleIcon} style={styles.buttonImage} />
                  </TouchableOpacity>
                </Layout>

              </Layout>
            ))
          )}
        </Layout>
      </SafeAreaView>
    ),
    nothing: () => <ErrorPage/>
  })
}

const styles = StyleSheet.create({
  mainPadding          : {
    paddingHorizontal: 16,
  },
  title                : {
    color     : 'black',
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 27,
  },
  subtitle             : {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 18,
  },
  workoutContainer     : {
    flexDirection: 'row',
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
  buttonContainer: {
    justifyContent   : 'center',
  },
  buttonImage: {
    height: 20,
    width: 20,
  }
})