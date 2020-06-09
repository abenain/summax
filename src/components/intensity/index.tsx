import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet, ViewStyle } from 'react-native'
import { IntensityLevel, Size } from '../../types'

const thunder = require('./thunder.png')

interface Props {
  level: IntensityLevel
  size: Size
  style?: ViewStyle
}

function getText(level: IntensityLevel) {
  switch (level) {
    case IntensityLevel.LOW:
      return i18n.t('Intensity - Low')
    case IntensityLevel.MEDIUM:
      return i18n.t('Intensity - Medium')
    case IntensityLevel.HIGH:
      return i18n.t('Intensity - High')
    default:
      return ''
  }
}

function getIconStyle(size: Size) {
  switch (size) {
    case Size.SMALL:
      return {
        height: 13,
        width : 11,
      }
    case Size.LARGE:
      return {
        height: 16,
        width : 14,
      }
    default:
      return {}
  }
}

function getTextCategory(size: Size) {
  switch (size) {
    case Size.LARGE:
      return 's1'
    case Size.SMALL:
    default:
      return 's2'
  }
}

export function Intensity({ level, size, style = {} }: Props) {
  return (
    <Layout style={[styles.container, style]}>

      <Image source={thunder} style={[styles.icon, getIconStyle(size)]}/>

      <Text category={getTextCategory(size)} style={styles.text}>{getText(level).toUpperCase()}</Text>

    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection  : 'row',
    backgroundColor: 'transparent'
  },
  icon     : {
    marginRight: 8,
  },
  text     : {
    color: 'white'
  },
})