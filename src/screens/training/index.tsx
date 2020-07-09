import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import { Subscription } from '@unimodules/core'
import { AVPlaybackStatus, Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Orientation, OrientationChangeEvent, OrientationLock } from 'expo-screen-orientation'
import VideoPlayer from 'expo-video-player'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { ErrorPage } from '../../components/ErrorPage'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { format, useTimer } from '../../hooks/useTimer'
import { GlobalState } from '../../redux/store'
import { Exercise, ExerciseModality } from '../../types'
import { NoOp } from '../../utils'
import { getExerciseVideoUrl } from '../../webservices/utils'
import { ExerciseList } from './ExerciseList'
import { TrainingExit } from './TrainingExit'

const greenClockIcon = require('../../../assets/clock-green.png')
const repsIcon = require('./reps.png')
const nextIcon = require('./next.png')

export function TrainingScreen() {
  const navigation: StackNavigationProp<RootStackParamList, 'Training'> = useNavigation()
  const selectedWorkout = useSelector(({ uiState: { selectedWorkout } }: GlobalState) => selectedWorkout)
  const orientationChangedSubscription = useRef<Maybe<Subscription>>(Maybe.nothing())
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(-1)
  const [currentExercise, setCurrentExercise] = useState(Maybe.nothing<Exercise>())
  const [isPlaying, setIsPlaying] = useState(false)
  const [timerValue, startTimer, stopTimer, setTimerValue] = useTimer({
    countdown         : true,
    onCountdownExpired: () => nextExercise()
  })
  const [timerText, setTimerText] = useState(format(0))
  const [isLeaving, setIsLeaving] = useState(false)

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
    selectedWorkout.caseOf({
      just   : workout => {
        if (selectedExerciseIndex >= 0 && selectedExerciseIndex < workout.exercises.length) {
          const selectedExercise = workout.exercises[selectedExerciseIndex]
          setCurrentExercise(Maybe.just(selectedExercise))

          if (selectedExercise.modality === ExerciseModality.TIME) {
            setTimerValue(selectedExercise.duration * 1000)
            startTimer()
          }
        }
      },
      nothing: NoOp
    })
  }, [selectedExerciseIndex])


  const selectExerciseAt = (index: number) => {
    setSelectedExerciseIndex(index)
    setIsPlaying(true)
  }

  useEffect(function componentDidMount() {
    ScreenOrientation.unlockAsync()

    orientationChangedSubscription.current = Maybe.maybe(
      ScreenOrientation.addOrientationChangeListener(({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
        if (orientation === Orientation.PORTRAIT_UP) {
          setIsFullScreen(false)
          return
        }

        setIsFullScreen(true)
      })
    )

    selectedWorkout.caseOf({
      just   : workout => workout.exercises && workout.exercises.length && selectExerciseAt(0),
      nothing: () => {
      }
    })


    return function componentWillUnmount() {
      orientationChangedSubscription.current.caseOf({
        just   : subscription => {
          ScreenOrientation.removeOrientationChangeListener(subscription)
          orientationChangedSubscription.current = Maybe.nothing()
        },
        nothing: NoOp
      })

      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP)

      stopTimer()
    }
  }, [])

  function nextExercise() {
    const exerciseCount = selectedWorkout.valueOr({ exercises: [] }).exercises.length

    if (selectedExerciseIndex < 0) {
      return
    }

    if (selectedExerciseIndex < exerciseCount - 1) {
      selectExerciseAt(selectedExerciseIndex + 1)
      return
    }

    navigation.navigate('Reward')
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
      onQuit={navigation.popToTop}/>
  }

  return selectedWorkout.caseOf({
    just   : workout => (
      <Layout style={styles.mainContainer}>

        {currentExercise.caseOf({
          just   : exercise => (
            <VideoPlayer
              videoProps={{
                isLooping : true,
                shouldPlay: true,
                resizeMode: Video.RESIZE_MODE_CONTAIN,
                source    : {
                  uri: getExerciseVideoUrl(exercise)
                },
              }}
              inFullscreen={isFullScreen}
              height={isFullScreen ? Dimensions.get('window').height : 233}
              width={Dimensions.get('window').width}
              playbackCallback={(status: AVPlaybackStatus) => setIsPlaying(status.isLoaded && status.isPlaying)}
            />
          ),
          nothing: () => (
            <Layout style={{
              backgroundColor: 'black',
              height         : isFullScreen ? Dimensions.get('window').height : 233,
              width          : Dimensions.get('window').width,
            }}/>
          )
        })}

        {isFullScreen === false && (
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

              <ScrollView style={{ flex: 1 }}>
                <ExerciseList
                  activeIndex={selectedExerciseIndex >= 0 ? Maybe.just(selectedExerciseIndex) : Maybe.nothing()}
                  exercises={workout.exercises}/>
              </ScrollView>

              <Layout style={styles.buttonContainer}>
                <SummaxButton
                  buttonStyle={ButtonStyle.GREEN}
                  text={i18n.t('Training - Quit training')}
                  onPress={() => {
                    const isTimedExercise = currentExercise.caseOf({
                      just   : exercise => exercise.modality === ExerciseModality.TIME,
                      nothing: () => false
                    })

                    if (isTimedExercise) {
                      stopTimer()
                    }

                    setIsLeaving(true)
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
    lineHeight: 27,
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