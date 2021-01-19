import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import moment from 'moment'
import * as React from 'react'
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native'
import { SummaxColors } from '../../colors'

const statsCardBackground = require('./stats-card-background.png')

interface Props {
  firstTrainingDate: Date
  style?: ViewStyle
  trainingCount: number
  trainingTimeMinutes: number
  userIsPremium?: boolean
}

function formatMinutesPerTraining(minutesPerTraining: number) {
  const hoursPer = Math.floor(minutesPerTraining / 60)
  const minutesPer = minutesPerTraining % 60
  return `${hoursPer}h${minutesPer.toString().padStart(2, '0')}`
}

function shouldShowFirstTrainingDate(userIsPremium?: boolean, firstTrainingDate?: Date){
  return userIsPremium && firstTrainingDate
}

function getTrainingCountText(userIsPremium?: boolean, trainingCount?: number){
  if(!userIsPremium){
    return '-'
  }

  return (trainingCount || 0).toString()
}

function shouldShowMinutesPerTraining(userIsPremium?: boolean, trainingTimeMinutes?: number){
  return userIsPremium && trainingTimeMinutes
}

function getTrainingTimeMinutesText(userIsPremium?: boolean, trainingTimeMinutes?: number){
  if(!userIsPremium){
    return '-'
  }

  return (trainingTimeMinutes || 0).toString()
}

export function StatsCard({ firstTrainingDate, style = {}, trainingCount, trainingTimeMinutes, userIsPremium }: Props) {
  const minutesPerWorkout = Math.floor(trainingTimeMinutes / trainingCount)

  return (
    <ImageBackground source={statsCardBackground} style={[styles.posterContainer, style]}>
      <Layout style={styles.mainContainer}>
        <Layout style={[styles.statCell, { marginRight: 30 }]}>
          <Text style={styles.title}>{getTrainingCountText(userIsPremium, trainingCount)}</Text>
          <Text style={styles.subtitle}>{i18n.t('Statistics - Workout count')}</Text>
          {shouldShowFirstTrainingDate(userIsPremium, firstTrainingDate) ? (
            <Layout style={styles.textContainer}>
              <Text style={styles.text}>{`${i18n.t('Statistics - Since')} `}</Text>
              <Text
                style={[styles.text, { color: SummaxColors.slateGrey }]}>{moment(firstTrainingDate).format('DD/MM/YYYY')}</Text>
            </Layout>
          ) : null}
        </Layout>

        <Layout style={styles.statCell}>
          <Text style={styles.title}>{getTrainingTimeMinutesText(userIsPremium, trainingTimeMinutes)}</Text>
          <Text style={styles.subtitle}>{i18n.t('Statistics - Training duration')}</Text>
          {shouldShowMinutesPerTraining() ? (
            <Layout style={styles.textContainer}>
              <Text style={styles.text}>{`${i18n.t('Statistics - Thats')} `}</Text>
              <Text
                style={[styles.text, { color: SummaxColors.slateGrey }]}>{`${formatMinutesPerTraining(minutesPerWorkout)} `}</Text>
              <Text style={styles.text}>{`${i18n.t('Statistics - Per workout')} `}</Text>
            </Layout>
          ) : null}
        </Layout>
      </Layout>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  posterContainer: {
    minHeight      : 143,
    paddingVertical: 22,
    width          : '100%',
  },
  mainContainer  : {
    backgroundColor : 'transparent',
    flex            : 1,
    flexDirection   : 'row',
    marginHorizontal: 15,
  },
  statCell       : {
    backgroundColor: 'transparent',
    flex           : 1,
  },
  title          : {
    color       : SummaxColors.lightishGreen,
    fontFamily  : 'aktivGroteskXBold',
    fontSize    : 38,
    marginBottom: 5,
  },
  subtitle       : {
    color       : SummaxColors.midnight,
    fontFamily  : 'nexaXBold',
    fontSize    : 14,
    marginBottom: 8,
  },
  textContainer  : {
    alignSelf      : 'baseline',
    backgroundColor: 'transparent',
    flexDirection  : 'row',
  },
  text           : {
    color     : SummaxColors.blueGrey,
    fontFamily: 'nexaRegular',
    fontSize  : 12,
  },
})