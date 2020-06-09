import { Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'

interface Props {
  image: ImageSourcePropType
  onPress?: () => void
  style?: ViewStyle
  title: string
}

export function Filter({ image, onPress = () => {}, style = {}, title }: Props) {
  return (
    <TouchableOpacity style={style} activeOpacity={.8} onPress={onPress}>
      <Image source={image} style={styles.image}/>
      <Text category={'s1'} style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 5,
    resizeMode  : 'stretch',
    height      : 102,
    width       : '100%',
  },
  text : {
    alignSelf: 'center',
    marginTop: 8,
  },
})