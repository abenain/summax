import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { WorkoutDuration } from '../../../types'

const short = require('./short.png')
const medium = require('./medium.png')
const long = require('./long.png')

interface Props {
  onFilter?: (duration: WorkoutDuration) => void
}

export function DurationFilters({ onFilter = () => {} }: Props) {
  return (
    <Layout style={styles.container}>

      <Text category='h3' style={styles.title}>{i18n.t('Home - Intensity')}</Text>

      <Layout style={styles.filterRow}>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(WorkoutDuration.SHORT)}
          activeOpacity={.5}>
          <Image source={short} style={styles.image}/>
          <Text category={'s1'} style={styles.text}>{i18n.t('Filter - Duration - Short')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(WorkoutDuration.MEDIUM)}
          activeOpacity={.5}>
          <Image source={medium} style={styles.image}/>
          <Text category={'s1'} style={styles.text}>{i18n.t('Filter - Duration - Medium')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(WorkoutDuration.LONG)}
          activeOpacity={.5}>
          <Image source={long} style={styles.image}/>
          <Text category={'s1'} style={styles.text}>{i18n.t('Filter - Duration - Long')}</Text>
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
    marginBottom: 28,
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
    marginTop: 12,
  },
})