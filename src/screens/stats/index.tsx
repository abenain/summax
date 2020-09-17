import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from '../../components/Loading'
import { ActionType } from '../../redux/actions'
import { GlobalState } from '../../redux/store'
import { callAuthenticatedWebservice } from '../../webservices'
import * as WorkoutServices from '../../webservices/workouts'
import { StatsCard } from './statsCard'
import { UnfinishedWorkoutCard } from './unfinishedWorkoutCard'

const statsPoster = require('./summax-stats-poster.png')

export function StatsScreen() {
  const dispatch = useDispatch()
  const { user, workoutCatalog } = useSelector(({ contents: { workoutCatalog }, userData: { user } }: GlobalState) => ({
    user,
    workoutCatalog
  }))
  const [isLoading, setLoading] = useState(true)
  const keyExtractor = useCallback((workout, index) => workout === null ? 'poster' : `${workout.id}${index}`, [])
  const renderItem = useCallback(({ item: workout }) => {
    if(workout === null){
      return <Image resizeMode={'contain'} source={statsPoster} style={styles.poster}/>
    }

    return <UnfinishedWorkoutCard workout={workout} completionRatio={0}/>
  }, [])

  function loadFavorites() {
    return callAuthenticatedWebservice(WorkoutServices.loadFavorites)
      .then(workouts => {
        dispatch({
          type: ActionType.LOADED_FAVORITE_WORKOUTS,
          workouts,
        })

        setLoading(false)
      })
  }

  useEffect(function componentDidMount() {
    loadFavorites().then(() => setLoading(false))
  }, [])

  const unfinishedWorkouts = useMemo(() => user.caseOf({
    just   : user => user.favoriteWorkouts.map(workoutId => workoutCatalog[workoutId]),
    nothing: () => []
  }), [user.valueOr(null), Object.keys(workoutCatalog).map(key => JSON.stringify(workoutCatalog[key])).join('')])

  return isLoading ? (
    <Loading/>
  ) : (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

      <Layout style={styles.mainContainer}>

        <Text style={[styles.title, { marginBottom: 36, marginTop: 45 }]}>{i18n.t('Statistics - Workouts')}</Text>

        <StatsCard
          firstTrainingDate={new Date()}
          trainingCount={30}
          trainingTimeMinutes={2700}
          style={{ marginBottom: 52 }}
        />

        <Text style={[styles.subtitle, { marginBottom: 22 }]}>{i18n.t('Statistics - Unfinished Workouts')}</Text>

        {unfinishedWorkouts.length === 0 ? (
          <Layout style={{ flex: 1 }}>
            <Text style={styles.workoutTitle}>{i18n.t('Statistics - No unfinished workout')}</Text>
            <Layout style={{flex: 1}} />
            <Image resizeMode={'contain'} source={statsPoster} style={styles.poster}/>
          </Layout>
        ) : (
          <FlatList
            data={unfinishedWorkouts.concat(null)}
            keyExtractor={keyExtractor}
            removeClippedSubviews={true}
            renderItem={renderItem}
          />
        )}

      </Layout>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex             : 1,
    paddingHorizontal: 16,
  },
  title        : {
    color     : 'black',
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 30,
  },
  subtitle     : {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 18,
  },
  workoutTitle : {
    color     : 'black',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 24,
  },
  poster       : {
    marginBottom: 53,
    width       : '100%',
    height      : 85,
  },
})