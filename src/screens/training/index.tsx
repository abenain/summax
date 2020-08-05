import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import { Subscription } from '@unimodules/core'
import * as Amplitude from 'expo-analytics-amplitude'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Orientation, OrientationChangeEvent, OrientationLock } from 'expo-screen-orientation'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, SafeAreaView, ScaledSize, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { RootStackParamList } from '../../App'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { PlaybackStatus, VideoPlayer, VideoPlayerHandle } from '../../components/video-player'
import { format, useTimer } from '../../hooks/useTimer'
import { GlobalState } from '../../redux/store'
import { Exercise, ExerciseModality, Workout } from '../../types'
import { NoOp } from '../../utils'
import { callAuthenticatedWebservice } from '../../webservices'
import { fetchWarmup } from '../../webservices/workouts'
import { ExerciseList, ExerciseListHandle } from './ExerciseList'
import { TrainingExit } from './TrainingExit'

const greenClockIcon = require('../../../assets/clock-green.png')
const repsIcon = require('./reps.png')
const nextIcon = require('./next.png')


function getSmallSide({ height, width }: ScaledSize) {
  if (height < width) {
    return height
  }

  return width
}

export function TrainingScreen() {
  const screenWidthPortrait = useRef(getSmallSide(Dimensions.get('window')))
  const route = useRoute<RouteProp<RootStackParamList, 'Training'>>()
  const { warmup = false } = route.params
  const navigation: StackNavigationProp<RootStackParamList, 'Training'> = useNavigation()
  const selectedWorkout = useSelector(({ uiState: { selectedWorkout } }: GlobalState) => selectedWorkout)
  const [warmupWorkout, setWarmupWorkout] = useState(Maybe.nothing<Workout>())
  const orientationChangedSubscription = useRef<Maybe<Subscription>>(Maybe.nothing())
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(-1)
  const [currentExercise, setCurrentExercise] = useState(Maybe.nothing<Exercise>())
  const [isPlaying, setIsPlaying] = useState(false)
  const [timerValue, startTimer, stopTimer, setTimerValue] = useTimer({
    countdown         : true,
    onCountdownExpired: useCallback(nextExercise, [selectedExerciseIndex])
  })
  const [timerText, setTimerText] = useState(format(0))
  const [isLeaving, setIsLeaving] = useState(false)
  const exerciseList = useRef<ExerciseListHandle>()
  const videoPlayer = useRef<VideoPlayerHandle>()
  const getPlaylist = useCallback(() => {
    return getWorkout().caseOf({
      just   : workout => workout.exercises.map(({ mediaId }) => ({ mediaId })),
      nothing: () => ([])
    })
  }, [warmup, selectedWorkout.valueOr(null)])

  function getWorkout() {
    if (warmup) {
      return warmupWorkout
    }

    return selectedWorkout
  }

  useEffect(() => {
    setTimerText(format(timerValue))
  }, [Math.floor(timerValue / 1000)])

  useEffect(() => {
    const isTimedExercise = currentExercise.caseOf({
      just   : exercise => exercise.modality === ExerciseModality.TIME,
      nothing: () => false
    })

    if (isTimedExercise && isPlaying) {
      startTimer()
    }

    if (isTimedExercise && isPlaying === false) {
      stopTimer()
    }
  }, [isPlaying])

  useEffect(() => {
    getWorkout().caseOf({
      just   : workout => {
        if (selectedExerciseIndex >= 0 && selectedExerciseIndex < workout.exercises.length) {
          const selectedExercise = workout.exercises[selectedExerciseIndex]
          setCurrentExercise(Maybe.just(selectedExercise))

          if (selectedExercise.modality === ExerciseModality.TIME) {
            setTimerValue(selectedExercise.duration * 1000)
          }
        }
      },
      nothing: NoOp
    })
  }, [selectedExerciseIndex])

  const selectExerciseAt = async (index: number) => {
    if (isFullscreen === false) {
      exerciseList.current.scrollToExercise(index)
    }
    setSelectedExerciseIndex(index)
    setIsPlaying(false)
  }

  const handleOrientationChange = useCallback(({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
    if ((orientation === Orientation.PORTRAIT_UP || orientation === Orientation.PORTRAIT_DOWN) && isFullscreen === true) {
      setIsFullscreen(false)
    }

    if ((orientation === Orientation.LANDSCAPE_RIGHT || orientation === Orientation.LANDSCAPE_LEFT) && isFullscreen === false) {
      setIsFullscreen(true)
    }
  }, [isFullscreen])

  function subscribeToOrientationChanges(){
    orientationChangedSubscription.current = Maybe.maybe(ScreenOrientation.addOrientationChangeListener(handleOrientationChange))
  }

  function unsubscribeToOrientationChanges(){
    orientationChangedSubscription.current.caseOf({
      just   : subscription => {
        ScreenOrientation.removeOrientationChangeListener(subscription)
        orientationChangedSubscription.current = Maybe.nothing()
      },
      nothing: NoOp
    })
  }

  useEffect(function componentDidMount() {
    ScreenOrientation.unlockAsync()

    orientationChangedSubscription.current = Maybe.maybe(ScreenOrientation.addOrientationChangeListener(handleOrientationChange))

    Promise.resolve()
      .then(() => {
        if (warmup) {
          Amplitude.logEvent(EVENTS.PLAYED_WARMUP)

          return callAuthenticatedWebservice(fetchWarmup, {})
            .then(warmup => {
              setWarmupWorkout(warmup)
              return warmup
            })
        }

        Amplitude.logEventWithProperties(EVENTS.PLAYED_COURSE, {
          course: selectedWorkout.caseOf({
            just   : ({ title }) => title,
            nothing: () => ''
          })
        })

        return selectedWorkout
      })
      .then(workout => {
        setIsLoading(false)

        workout.caseOf({
          just   : workout => workout.exercises && workout.exercises.length && selectExerciseAt(0),
          nothing: () => {
          }
        })
      })

    return function componentWillUnmount() {
      unsubscribeToOrientationChanges()

      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP)

      stopTimer()
    }
  }, [])

  useEffect(() => {
    unsubscribeToOrientationChanges()
    subscribeToOrientationChanges()
  }, [isFullscreen])

  function onFullscreenButtonPress() {
    const newOrientation = isFullscreen ? OrientationLock.PORTRAIT_UP : OrientationLock.LANDSCAPE
    setIsFullscreen(!isFullscreen)
    ScreenOrientation.lockAsync(newOrientation)
      .then(ScreenOrientation.unlockAsync)
  }

  function nextExercise() {
    const exerciseCount = getWorkout().valueOr({ exercises: [] }).exercises.length

    if (selectedExerciseIndex < 0) {
      return
    }

    if (selectedExerciseIndex < exerciseCount - 1) {
      selectExerciseAt(selectedExerciseIndex + 1)
      return
    }

    if (warmup) {
      navigation.replace('Training', {})
    } else {
      navigation.navigate('Reward')
    }
  }

  if (isLoading) {
    return <Loading/>
  }

  if (isLeaving) {
    return <TrainingExit
      onResume={() => {
        const isTimedExercise = currentExercise.caseOf({
          just   : exercise => exercise.modality === ExerciseModality.TIME,
          nothing: () => false
        })

        setIsLeaving(false)

        if (isTimedExercise) {
          startTimer()
        }
      }}
      onQuit={() => {
        if (videoPlayer.current) {
          videoPlayer.current.stop()
        }
        navigation.replace('Home')
      }
      }/>
  }

  return getWorkout().caseOf({
    just   : workout => (
      <Layout style={styles.mainContainer}>

        <VideoPlayer
          currentPlaylistItem={selectedExerciseIndex}
          fullscreen={isFullscreen}
          height={233}
          onFullscreenButtonPress={onFullscreenButtonPress}
          onPlaybackStatusChanged={(status) => {
            setIsPlaying(status === PlaybackStatus.PLAYING)
          }}
          width={screenWidthPortrait.current}
          playlist={getPlaylist()}
        />

        {isFullscreen === false && (
          <SafeAreaView style={styles.safeContentsArea}>
            <Layout style={styles.contents}>

              <Layout style={styles.titleContainer}>
                <Text style={styles.title}>{workout.title}</Text>
              </Layout>

              <Layout style={styles.controlsContainer}>

                <SummaxButton
                  buttonStyle={ButtonStyle.WHITE}
                  style={styles.chronoRepControl}>
                  {
                    currentExercise.caseOf({
                      just   : exercise => {
                        const icon = currentExercise && exercise.modality === ExerciseModality.TIME ? greenClockIcon : repsIcon
                        const text = currentExercise && exercise.modality === ExerciseModality.TIME ? timerText : `${exercise.duration} reps`

                        return (
                          <>
                            <Image
                              source={icon}
                              style={styles.clockIcon}
                              resizeMode={'contain'}/>
                            <Text style={[styles.controlsText, styles.timerText]}>{text}</Text>
                          </>
                        )
                      },
                      nothing: () => null
                    })
                  }
                </SummaxButton>

                <SummaxButton
                  buttonStyle={ButtonStyle.GREEN}
                  style={styles.nextControl}
                  onPress={nextExercise}>
                  <Image
                    source={nextIcon}
                    style={styles.nextIcon}
                    resizeMode={'contain'}/>
                  <Text style={[styles.controlsText, styles.nextText]}>{i18n.t('Training - Next exercise')}</Text>
                </SummaxButton>
              </Layout>

              <Layout style={{ flex: 1 }}>
                <ExerciseList
                  activeIndex={selectedExerciseIndex >= 0 ? Maybe.just(selectedExerciseIndex) : Maybe.nothing()}
                  exercises={workout.exercises}
                  onPress={selectExerciseAt}
                  ref={exerciseList}
                />
              </Layout>

              <Layout style={styles.buttonContainer}>
                <SummaxButton
                  buttonStyle={ButtonStyle.GREEN}
                  text={warmup ? i18n.t('Training - Quit warmup') : i18n.t('Training - Quit training')}
                  onPress={() => {
                    if (warmup) {
                      navigation.replace('Training', {})
                    } else {
                      const isTimedExercise = currentExercise.caseOf({
                        just   : exercise => exercise.modality === ExerciseModality.TIME,
                        nothing: () => false
                      })

                      if (isTimedExercise) {
                        stopTimer()
                      }

                      setIsLeaving(true)

                      Amplitude.logEventWithProperties(EVENTS.PRESSED_LEAVE_COURSE_BTN, {
                        course  : workout.title,
                        exercise: currentExercise.caseOf(({
                          just   : ({ title }) => title,
                          nothing: () => ''
                        }))
                      })
                    }
                  }}
                />
              </Layout>

            </Layout>
          </SafeAreaView>
        )}
      </Layout>
    ),
    nothing: () => <ErrorPage/>
  })
}

const styles = StyleSheet.create({
  mainContainer    : {
    alignItems: 'center',
    flex      : 1,
  },
  safeContentsArea : {
    alignSelf: 'stretch',
    flex     : 1,
  },
  contents         : {
    alignSelf        : 'stretch',
    flex             : 1,
    paddingHorizontal: 16,
  },
  titleContainer   : {
    marginBottom: 30,
    marginTop   : 47,
  },
  title            : {
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 30,
  },
  controlsContainer: {
    flexDirection: 'row',
    marginBottom : 33,
  },
  chronoRepControl : {
    borderBottomRightRadius: 0,
    borderTopRightRadius   : 0,
    height                 : 94,
    marginRight            : 0,
  },
  clockIcon        : {
    height      : 26,
    marginBottom: 8,
    width       : 26,
  },
  controlsText     : {
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 27,
  },
  timerText        : {
    fontVariant: ['tabular-nums'],
  },
  nextControl      : {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius   : 0,
    height                : 94,
  },
  nextIcon         : {
    height      : 20,
    marginBottom: 11,
    width       : 29,
  },
  nextText         : {
    color: 'white'
  },
  buttonContainer  : {
    marginTop: 33,
    height   : 56,
  },
})