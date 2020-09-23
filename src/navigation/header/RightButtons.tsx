import { useNavigation } from '@react-navigation/native'
import { Layout } from '@ui-kitten/components'
import * as React from 'react'
import { Image, TouchableOpacity } from 'react-native'

const personBlack = require('./person-black.png')
const personWhite = require('./person-white.png')

export enum ButtonsTint {
  DARK,
  LIGHT,
}

interface Props {
  tint?: ButtonsTint
  tintColor?: string
}

function getPersonIcon(tint: ButtonsTint){
  switch (tint) {
    case ButtonsTint.DARK:
      return personBlack
    case ButtonsTint.LIGHT:
    default:
      return personWhite
  }
}

export function RightButtons(props: Props) {
  const navigation = useNavigation()
  return (
    <Layout style={{ backgroundColor: 'transparent', flexDirection: 'row', paddingRight: 16, }} {...props}>

      <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('Profile')}>
        <Image source={getPersonIcon(props.tint)} style={{ height: 24, width: 24 }}/>
      </TouchableOpacity>

    </Layout>
  )
}