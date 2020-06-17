import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, ImageSourcePropType, ImageStyle, StyleSheet } from 'react-native'
import { WorkoutDuration } from '../../types'
import { durationFrom } from '../duration-filters'

const clockGreen = require('./clock-green.png')
const clockGrey = require('./clock-grey.png')

export enum Size {
  SMALL,
  LARGE,
}

export enum IconMode {
  MULTIPLE,
  SINGLE,
}

interface Props {
  durationMin: number
  iconMode?: IconMode
  size: Size
  textColor?: string
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
        height: 15,
        width : 13,
      }
    default:
      return {}
  }
}

function getTextStyle(size: Size) {
  switch (size) {
    case Size.LARGE:
      return {
        fontSize: 14,
      }
    case Size.SMALL:
      return {
        fontSize: 12
      }
    default:
      return {}
  }
}

function getOneIcon(size: Size, source: ImageSourcePropType, style = {} as ImageStyle) {
  return (
    <Image source={source} style={[styles.icon, getIconStyle(size), style]}/>
  )
}

function getIcons(iconMode: IconMode, level: WorkoutDuration, size: Size) {
  switch (iconMode) {
    case IconMode.MULTIPLE:
      return (
        <>
          {getOneIcon(size, clockGreen, { marginRight: 3 })}
          {getOneIcon(size, level > WorkoutDuration.SHORT ? clockGreen : clockGrey, { marginRight: 3 })}
          {getOneIcon(size, level > WorkoutDuration.MEDIUM ? clockGreen : clockGrey)}
        </>
      )
    case IconMode.SINGLE:
      return getOneIcon(size, clockGreen)
    default:
      return null
  }
}

export function Duration({ durationMin, iconMode = IconMode.SINGLE, size, textColor = 'white' }: Props) {
  return (
    <Layout style={styles.container}>

      {getIcons(iconMode, durationFrom(durationMin), size)}

      <Text style={[styles.text, getTextStyle(size), { color: textColor }]}>{i18n.t('X min', { durationMin })}</Text>

    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection  : 'row',
    backgroundColor: 'transparent',
    alignItems     : 'center',
  },
  icon     : {
    marginRight: 8,
  },
  text     : {
    fontFamily: 'nexaXBold',
    lineHeight: 24,
  },
})