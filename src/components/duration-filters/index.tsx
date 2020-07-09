import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { WorkoutDuration } from '../../types'
import { NoOp } from '../../utils'

const short = require('./short.png')
const medium = require('./medium.png')
const long = require('./long.png')

const SHORT_DURATION_MAX_MINS = 7
const MEDIUM_DURATION_MAX_MINS = 14

interface Props {
  onFilter?: (duration: WorkoutDuration) => void
}

export function getTitleForDuration(duration: WorkoutDuration){
  switch(duration){
    case WorkoutDuration.SHORT:
      return i18n.t('Filter - Duration - Short')
    case WorkoutDuration.MEDIUM:
      return i18n.t('Filter - Duration - Medium')
    case WorkoutDuration.LONG:
      return i18n.t('Filter - Duration - Long')
    default:
      return ''
  }
}

export function durationFrom(durationMin: number){
  if(durationMin <= SHORT_DURATION_MAX_MINS){
    return WorkoutDuration.SHORT
  }

  if(durationMin <= MEDIUM_DURATION_MAX_MINS){
    return WorkoutDuration.MEDIUM
  }

  return WorkoutDuration.LONG
}

export function DurationFilters({ onFilter = NoOp }: Props) {
  return (
    <Layout style={styles.container}>

      <Text style={styles.title}>{i18n.t('Home - Duration')}</Text>

      <Layout style={styles.filterRow}>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(WorkoutDuration.SHORT)}
          activeOpacity={.5}>
          <Image source={short} style={styles.image}/>
          <Text style={styles.text}>{getTitleForDuration(WorkoutDuration.SHORT)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(WorkoutDuration.MEDIUM)}
          activeOpacity={.5}>
          <Image source={medium} style={styles.image}/>
          <Text style={styles.text}>{getTitleForDuration(WorkoutDuration.MEDIUM)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(WorkoutDuration.LONG)}
          activeOpacity={.5}>
          <Image source={long} style={styles.image}/>
          <Text style={styles.text}>{getTitleForDuration(WorkoutDuration.LONG)}</Text>
        </TouchableOpacity>

      </Layout>

    </Layout>
  )
}

const styles = StyleSheet.create({
  container      : {
    backgroundColor  : 'rgb(246,246,246)',
    paddingHorizontal: 16,
    paddingVertical  : 32,
  },
  title          : {
    color       : 'black',
    marginBottom: 24,
    fontFamily  : 'aktivGroteskXBold',
    fontSize    : 30,
  },
  filterRow      : {
    flexDirection    : 'row',
    paddingHorizontal: 16,
    justifyContent   : 'space-between',
    backgroundColor  : 'transparent',
  },
  filterContainer: {
    backgroundColor: 'transparent',
    alignItems     : 'center',
  },
  image          : {
    height: 54,
    width : 54,
  },
  text           : {
    marginTop : 12,
    fontFamily: 'nexaXBold',
    fontSize  : 14,
  },
})