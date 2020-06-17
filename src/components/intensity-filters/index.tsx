import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { IntensityLevel } from '../../types'
import { NoOp } from '../../utils'

const low = require('./low.png')
const medium = require('./medium.png')
const high = require('./high.png')

interface Props {
  onFilter?: (intensity: IntensityLevel) => void
}

export function IntensityFilters({ onFilter = NoOp }: Props) {
  return (
    <Layout style={styles.container}>

      <Text style={styles.title}>{i18n.t('Home - Intensity')}</Text>

      <Layout style={styles.filterRow}>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(IntensityLevel.LOW)}
          activeOpacity={.5}>
          <Image source={low} style={styles.image}/>
          <Text style={styles.text}>{i18n.t('Filter - Intensity - Low')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(IntensityLevel.MEDIUM)}
          activeOpacity={.5}>
          <Image source={medium} style={styles.image}/>
          <Text style={styles.text}>{i18n.t('Filter - Intensity - Medium')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterContainer}
          onPress={() => onFilter(IntensityLevel.HIGH)}
          activeOpacity={.5}>
          <Image source={high} style={styles.image}/>
          <Text style={styles.text}>{i18n.t('Filter - Intensity - High')}</Text>
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