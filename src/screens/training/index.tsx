import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import * as Amplitude from 'expo-analytics-amplitude'
import Constants from 'expo-constants'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import * as ScreenOrientation from 'expo-screen-orientation'
import { OrientationLock } from 'expo-screen-orientation'
import i18n from 'i18n-js'
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, Dimensions, Image, Platform, SafeAreaView, ScaledSize, StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress'
import { useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { EVENTS } from '../../amplitude'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { ErrorPage } from '../../components/ErrorPage'
import { Loading } from '../../components/Loading'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { PlaybackStatus, VideoPlayer, VideoPlayerHandle } from '../../components/video-player'
import { format, useTimer } from '../../hooks/useTimer'
import { GlobalState } from '../../redux/store'
import { Exercise, ExerciseModality, Workout, WorkoutSession } from '../../types'
import { NoOp } from '../../utils'
import { callAuthenticatedWebservice } from '../../webservices'
import { fetchWarmup } from '../../webservices/workouts'
import { getOrCreateSession, updateSession } from '../../webservices/workoutSessions'
import { ExerciseList, ExerciseListHandle } from './ExerciseList'
import { TrainingExit } from './TrainingExit'

const greenClockIcon = require('../../../assets/clock-green.png')
const repsIcon = require('./reps.png')
const nextIcon = require('./next.png')

const KEEP_AWAKE_TAG = 'trainingScreen'
const SESSION_REPORTING_INTERVAL_MS = 30000

function getSmallSide({ height, width }: ScaledSize) {
  if (height < width) {
    return height
  }

  return width
}

export function TrainingScreen() {
  const screenWidthPortrait = useRef(getSmallSide(Dimensions.get('window')))
  const route = useRoute<RouteProp<RootStackParamList, 'Training'>>()
  const { warmup = false, startAtExercise = 0 } = route.params
  const navigation: StackNavigationProp<RootStackParamList, 'Training'> = useNavigation()
  const { selectedWorkoutId, workoutCatalog } = useSelector(({ contents: { workoutCatalog }, uiState: { selectedWorkoutId } }: GlobalState) => ({
    selectedWorkoutId,
    workoutCatalog
  }))
  const [warmupWorkout, setWarmupWorkout] = useState(Maybe.nothing<Workout>())
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(-1)
  const [currentExercise, setCurrentExercise] = useState(Maybe.nothing<Exercise>())
  const [isPlaying, setIsPlaying] = useState(false)
  const [timerText, setTimerText] = useState(format(0))
  const [isLeaving, setIsLeaving] = useState(false)
  const [workoutSession, setWorkoutSession] = useState(Maybe.nothing<WorkoutSession>())
  const exerciseList = useRef<ExerciseListHandle>()
  const videoPlayer = useRef<VideoPlayerHandle>()
  const appState = useRef(AppState.currentState)

  function handleAppStateChange(nextAppState) {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      startCountdownTimer()
      startTotalTimer()
    }

    if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      stopCountdownTimer()
      stopTotalTimer()
    }

    appState.current = nextAppState
  }

  const getPlaylist = useCallback(() => {
    return getWorkout().caseOf({
      just   : workout => workout.exercises.map(({ mediaId }) => ({ mediaId })),
      nothing: () => ([])
    })
  }, [warmup, warmupWorkout.valueOr(null), selectedWorkoutId.valueOr(null)])

  const getWorkout = useCallback(() => {
    if (warmup) {
      return warmupWorkout
    }

    return selectedWorkoutId.map(id => workoutCatalog[id])
  }, [warmupWorkout.valueOr(null), selectedWorkoutId.valueOr(null), Object.keys(workoutCatalog).map(key => JSON.stringify(workoutCatalog[key])).join('')])

  const nextExercise = useCallback(async () => {
    const exerciseCount = getWorkout().valueOr({ exercises: [] }).exercises.length

    if (selectedExerciseIndex < 0) {
      return
    }

    if (selectedExerciseIndex < exerciseCount - 1) {
      selectExerciseAt(selectedExerciseIndex + 1, isFullscreen === false)
      return
    }

    videoPlayer.current.stop()
    await ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP)
    if (warmup) {
      navigation.replace('Training', {})
    } else {
      workoutSession.caseOf({
        just   : session => {
          callAuthenticatedWebservice(updateSession, {
            sessionId: session._id,
            finished : true,
          })
        },
        nothing: NoOp,
      })
      navigation.navigate('Reward')
    }
  }, [isFullscreen, selectedExerciseIndex, workoutSession.valueOr(null)])

  const updateWorkoutSessionTimeSpent = useCallback(() => {
    workoutSession.caseOf({
      just   : session => {
        callAuthenticatedWebservice(updateSession, {
          sessionId  : session._id,
          timeSpentMs: SESSION_REPORTING_INTERVAL_MS,
        })
      },
      nothing: NoOp,
    })
  }, [workoutSession.valueOr(null)])

  const [countdownTimerValue, startCountdownTimer, stopCountdownTimer, setCountdownTimerValue] = useTimer({
    countdown         : true,
    onCountdownExpired: nextExercise,
  })

  const [, startTotalTimer, stopTotalTimer, setTotalTimerValue] = useTimer({
    notificationIntervalMs: SESSION_REPORTING_INTERVAL_MS,
    onIntervalElapsed     : updateWorkoutSessionTimeSpent
  })

  useEffect(() => {
    setTimerText(format(countdownTimerValue))
  }, [Math.floor(countdownTimerValue / 1000)])

  useEffect(() => {
    const isTimedExercise = currentExercise.caseOf({
      just   : exercise => exercise.modality === ExerciseModality.TIME,
      nothing: () => false
    })

    if (isPlaying) {
      startTotalTimer()
      if (isTimedExercise) {
        startCountdownTimer()
      }
    } else {
      stopTotalTimer()
      if (isTimedExercise) {
        stopCountdownTimer()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    getWorkout().caseOf({
      just   : workout => {
        if (selectedExerciseIndex >= 0 && selectedExerciseIndex < workout.exercises.length) {
          const selectedExercise = workout.exercises[selectedExerciseIndex]
          setCurrentExercise(Maybe.just(selectedExercise))

          if (selectedExercise.modality === ExerciseModality.TIME) {
            setCountdownTimerValue(selectedExercise.duration * 1000)
          }
        }
      },
      nothing: NoOp
    })
  }, [selectedExerciseIndex])

  const selectExerciseAt = useCallback((index: number, scrollToExercise: boolean) => {
    if (scrollToExercise && exerciseList.current) {
      exerciseList.current.scrollToExercise(index)
    }
    setSelectedExerciseIndex(index)

    workoutSession.caseOf({
      just   : session => {
        callAuthenticatedWebservice(updateSession, {
          sessionId        : session._id,
          doneExerciseCount: index,
        })
      },
      nothing: NoOp,
    })
  }, [workoutSession.valueOr(null)])

  useEffect(function componentDidMount() {
    AppState.addEventListener('change', handleAppStateChange)
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
          course: getWorkout().caseOf({
            just   : ({ title }) => title,
            nothing: () => ''
          })
        })

        return callAuthenticatedWebservice(getOrCreateSession, {
          totalExerciseCount: getWorkout().map(workout => workout.exercises.length).valueOr(0),
          workoutId         : selectedWorkoutId.valueOr(null)
        }).then(session => {
          setWorkoutSession(session)
          return getWorkout()
        })
      })
      .then(workout => {
        setIsLoading(false)

        workout.caseOf({
          just   : workout => {
            if (workout.exercises && workout.exercises.length) {
              setTimeout(() => selectExerciseAt(startAtExercise, true), 500)
            }
          },
          nothing: () => {
          }
        })
      })

    return function componentWillUnmount() {
      AppState.removeEventListener('change', handleAppStateChange)
      deactivateKeepAwake(KEEP_AWAKE_TAG)
      stopCountdownTimer()
      stopTotalTimer()
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      activateKeepAwake(KEEP_AWAKE_TAG)
      setTotalTimerValue(0)
      startTotalTimer()
    }, [])
  )

  useEffect(() => {
    if (isFullscreen === false && exerciseList.current) {
      exerciseList.current.scrollToExercise(selectedExerciseIndex)
    }
  }, [isFullscreen])

  const onFullscreenButtonPress = useCallback(() => {
    const newOrientation = isFullscreen ? OrientationLock.PORTRAIT_UP : OrientationLock.LANDSCAPE
    setIsFullscreen(!isFullscreen)
    ScreenOrientation.lockAsync(newOrientation)
  }, [isFullscreen])

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
          startCountdownTimer()
        }

        startTotalTimer()
      }}
      onQuit={() => {
        deactivateKeepAwake(KEEP_AWAKE_TAG)
        if (videoPlayer.current) {
          videoPlayer.current.stop()
        }
        navigation.replace('Home')
      }
      }/>
  }

  const { width: screenWidth } = Dimensions.get('window')

  return getWorkout().caseOf({
    just   : workout => (
      <>

        <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }}/>

        <SafeAreaView
          style={[styles.mainContainer, { paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }]}>

          <VideoPlayer
            ref={videoPlayer}
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

              <Layout style={styles.progressContainer}>
                <Text style={[styles.progressText, { marginBottom: 4, }]}>{i18n.t('Training - Workout progress')}</Text>
                <Progress.Bar progress={Math.max(selectedExerciseIndex, 0) / workout.exercises.length}
                              width={screenWidth - 32} color={SummaxColors.lightishGreen}/>
                <Text
                  style={[styles.progressText, { marginTop: 8, }]}>{Math.floor(Math.max(selectedExerciseIndex, 0) * 100 / workout.exercises.length)}%</Text>
              </Layout>

              <Layout style={styles.contents}>
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
                    onPress={index => selectExerciseAt(index, true)}
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
                          stopCountdownTimer()
                        }

                        stopTotalTimer()

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
        </SafeAreaView>
      </>
    ),
    nothing: () => <ErrorPage/>
  })
}

const styles = StyleSheet.create({
  mainContainer    : {
    alignItems     : 'center',
    backgroundColor: 'white',
    flex           : 1,
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
  progressContainer: {
    alignItems     : 'center',
    backgroundColor: 'black',
    justifyContent : 'center',
    marginBottom   : 8,
    paddingVertical  : 8,
  },
  progressText     : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
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