import { Layout, Spinner } from '@ui-kitten/components'
import * as React from 'react'
import { Dimensions, Image, StyleSheet } from 'react-native'

const summaxIcon = require('../../assets/icon.png')

const dimensions = Dimensions.get('window')
const imageSize = Math.round(dimensions.width / 3)

export function Loading() {
  return (
    <Layout style={styles.container}>
      <Layout style={styles.iconContainer}>
        <Image source={summaxIcon} style={styles.icon}/>
      </Layout>
      <Layout style={styles.spinnerContainer}>
        <Spinner size='giant' status='success'/>
      </Layout>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container       : {
    alignSelf: 'stretch',
    flex     : 1,
  },
  iconContainer   : {
    alignItems     : 'center',
    backgroundColor: 'black',
    flex           : 1,
    justifyContent : 'flex-end',
  },
  icon            : {
    height    : imageSize,
    resizeMode: 'contain',
    width     : imageSize,
  },
  spinnerContainer: {
    alignSelf      : 'stretch',
    alignItems     : 'center',
    backgroundColor: 'black',
    flex           : 1,
    paddingTop     : 16,
  },
})