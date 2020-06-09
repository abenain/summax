import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'

const clock = require('./clock.png')

export enum Size {
  SMALL,
  LARGE,
}

interface Props {
  durationMin: number
  size: Size
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

function getTextCategory(size: Size) {
  switch (size) {
    case Size.LARGE:
      return 's1'
    case Size.SMALL:
    default:
      return 's2'
  }
}

export function Duration({ durationMin, size }: Props) {
  return (
    <Layout style={styles.container}>

      <Image source={clock} style={[styles.icon, getIconStyle(size)]}/>

      <Text category={getTextCategory(size)} style={styles.text}>{i18n.t('X min', { durationMin })}</Text>

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
    color: 'white'
  },
})