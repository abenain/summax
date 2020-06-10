import { Layout } from '@ui-kitten/components'
import * as React from 'react'
import { Image } from 'react-native'

const summax = require('./summax.png')

export function HeaderTitle(props: {}){
  return (
    <Layout {...props} style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <Image source={summax} style={{ height: 19.6, width: 101 }}/>
    </Layout>
  )
}