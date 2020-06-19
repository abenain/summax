import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Maybe } from 'tsmonad'
import { SummaxColors } from '../../colors'
import { Exercise, ExerciseModality } from '../../types'

const playIcon = require('./play-green.png')

interface Props {
  activeIndex: Maybe<number>
  exercises: Exercise[]
}

function getDurationUnitsAsString(modality: ExerciseModality) {
  switch (modality) {
    case ExerciseModality.REPETITIONS:
      return i18n.t('Exercise - Repetitions')
    case ExerciseModality.TIME:
      return i18n.t('Exercise - Seconds')
    default:
      return ''
  }
}

function getFormattedDuration(exercise: Exercise) {
  return `${exercise.duration} ${getDurationUnitsAsString(exercise.modality)}`
}

export function ExerciseList({ activeIndex, exercises }: Props) {
  return (
    <Layout style={styles.container}>
      {exercises.map((exercise, index) => (
        <Layout
          key={`${exercise.title}${index}`}
          style={[
            styles.exerciseContainer,
            index === 0 ? styles.firstExercise : {},
            index === exercises.length - 1 ? styles.lastExercise : {}
          ]}>

          <Image
            resizeMode={'contain'}
            source={exercise.thumbnailImage}
            style={styles.exerciseThumbnail}/>

            <Layout style={styles.exerciseDetailsContainer}>
            <Text style={styles.exerciseTitle}>{exercise.title}</Text>
            <Text style={styles.exerciseDuration}>{getFormattedDuration(exercise)}</Text>
          </Layout>

          <Layout style={{justifyContent: 'center'}}>
            {activeIndex.caseOf({
              just   : activeIndex => index === activeIndex && (
                <Image source={playIcon} style={styles.playIcon} resizeMode={'contain'}/>
              ),
              nothing: () => null
            })}
          </Layout>

        </Layout>
      ))}
    </Layout>
  )
}

const styles = StyleSheet.create({
  container               : {
    paddingVertical: 33,
  },
  exerciseContainer       : {
    borderBottomWidth: 1,
    borderColor      : SummaxColors.lightGrey,
    flexDirection    : 'row',
    paddingVertical  : 16,
  },
  firstExercise           : {
    paddingTop: 0,
  },
  lastExercise            : {
    borderBottomWidth: 0,
    paddingBottom    : 0,
  },
  exerciseThumbnail       : {
    height: 74,
    width : 131,
  },
  exerciseDetailsContainer: {
    flex        : 1,
    padding     : 16,
    paddingRight: 4,
  },
  exerciseTitle           : {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 24,
  },
  exerciseDuration        : {
    fontFamily: 'nexaRegular',
    fontSize  : 12,
    lineHeight: 16,
  },
  playIcon                : {
    height: 20,
    width : 46,
  }
})