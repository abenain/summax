import { Layout } from '@ui-kitten/components'
import * as React from 'react'
import { ViewStyle } from 'react-native'

const DEFAULT_COLOR = 'rgb(227, 227, 227)'

interface Props {
  color?: string
  style?: ViewStyle
}

export function Separator({color = DEFAULT_COLOR, style = {}}: Props){
  return (
    <Layout style={style}>
      <Layout style={{
        borderColor: color,
        borderTopWidth: 1,
        width: '100%'
      }}/>
    </Layout>
  )
}