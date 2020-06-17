import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, ImageSourcePropType, ImageStyle, StyleSheet, ViewStyle } from 'react-native'
import { IntensityLevel } from '../../types'

const boltGreen = require('./bolt-green.png')
const boltGrey = require('./bolt-grey.png')

export enum Size {
  SMALL,
  LARGE,
}

export enum IconMode {
  MULTIPLE,
  SINGLE,
}

interface Props {
  iconMode?: IconMode
  level: IntensityLevel
  size: Size
  style?: ViewStyle
  textColor?: string
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

function getTextStyle(size: Size) {
  switch (size) {
    case Size.LARGE:
      return {
        fontSize: 14
      }
    case Size.SMALL:
      return {
        fontSize: 12
      }
    default:
      return {}
  }
}

function getOneIcon(size: Size, source: ImageSourcePropType, style = {} as ImageStyle){
  return (
    <Image source={source} style={[styles.icon, getIconStyle(size), style]}/>
  )
}

function getIcons(iconMode: IconMode, level: IntensityLevel, size: Size){
  switch(iconMode){
    case IconMode.MULTIPLE:
      return (
        <>
          {getOneIcon(size, boltGreen, {marginRight: 3})}
          {getOneIcon(size, level > IntensityLevel.LOW ? boltGreen : boltGrey, {marginRight: 3})}
          {getOneIcon(size, level > IntensityLevel.MEDIUM ? boltGreen : boltGrey)}
        </>
      )
    case IconMode.SINGLE:
      return getOneIcon(size, boltGreen)
    default:
      return null
  }
}

export function Intensity({ iconMode = IconMode.SINGLE, level, size, style = {}, textColor = 'white' }: Props) {
  return (
    <Layout style={[styles.container, style]}>

      {getIcons(iconMode, level, size)}

      <Text style={[styles.text, getTextStyle(size), {color: textColor}]}>{getText(level).toUpperCase()}</Text>

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