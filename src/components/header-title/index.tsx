import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'

const summax = require('./summax.png')

interface Props {
  title?: string
  [key: string]: any
}

export function HeaderTitle(props: Props){
  return (
    <Layout {...props} style={[styles.container, {backgroundColor: 'transparent'}]}>
      {props.title ? (
        <Text style={styles.title}>{props.title}</Text>
      ) : (
        <Image source={summax} style={{ height: 19.6, width: 101 }}/>
      )}
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    color     : 'white'
  },
})