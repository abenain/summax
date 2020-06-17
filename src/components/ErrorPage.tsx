import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Dimensions, Image, StyleSheet } from 'react-native'

const summaxIcon = require('../../assets/icon.png')

const dimensions = Dimensions.get('window')
const imageSize = Math.round(dimensions.width / 3)

export function ErrorPage() {
  return (
    <Layout style={styles.container}>
      <Layout style={styles.iconContainer}>
        <Image source={summaxIcon} style={styles.icon}/>
      </Layout>
      <Layout style={styles.messageContainer}>
        <Text style={styles.message}>{i18n.t('Error Page Message')}</Text>
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
  messageContainer: {
    alignSelf        : 'stretch',
    alignItems       : 'center',
    backgroundColor  : 'black',
    flex             : 1,
    paddingTop       : 16,
    paddingHorizontal: 32,
  },
  message         : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    textAlign : 'center',
  },
})