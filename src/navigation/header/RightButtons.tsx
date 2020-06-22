import { useNavigation } from '@react-navigation/native'
import { Layout } from '@ui-kitten/components'
import * as React from 'react'
import { Image, TouchableOpacity } from 'react-native'

const personBlack = require('./person-black.png')

export function RightButtons(props: { tintColor?: string }) {
  const navigation = useNavigation()
  return (
    <Layout style={{ paddingRight: 16 }} {...props}>
      <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('Profile')}>
        <Image source={personBlack} style={{ height: 24, width: 24 }}/>
      </TouchableOpacity>
    </Layout>
  )
}