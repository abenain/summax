import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { NoOp } from '../../../utils'

interface Props {
  image: ImageSourcePropType
  onPress?: () => void
  style?: ViewStyle
  title: string
}

export function Filter({ image, onPress = NoOp, style = {}, title }: Props) {
  return (
    <TouchableOpacity style={style} activeOpacity={.8} onPress={onPress}>
      <Image source={image} style={styles.image}/>
      <Layout style={styles.textContainer}>
        <Text style={styles.text}>{title}</Text>
      </Layout>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image        : {
    borderRadius: 5,
    resizeMode  : 'stretch',
    height      : 102,
    width       : '100%',
  },
  textContainer: {
    marginTop: 8,
    height   : 20,
  },
  text         : {
    alignSelf : 'center',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
})