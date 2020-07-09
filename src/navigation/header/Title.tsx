import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'

const summax = require('../../../assets/summax.png')

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
        <Image source={summax} style={{ height: 20, width: 103 }} resizeMode={'contain'}/>
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
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  title: {
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    color     : 'white'
  },
})