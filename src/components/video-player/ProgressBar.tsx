import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

interface Props {
  progress: number
}

export function ProgressBar({ progress }: Props) {
  let animation = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue : progress,
      duration: 100
    }).start()
  }, [progress])

  const width = animation.current.interpolate({
    inputRange : [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  })

  return (
    <View style={styles.progressBar}>
      <Animated.View style={[styles.absoluteFill, { backgroundColor: 'white', width }]}/>
    </View>
  )
}

const styles = StyleSheet.create({
  absoluteFill: {
    borderRadius: 5,
    position    : 'absolute',
    left        : 0,
    right       : 0,
    top         : 0,
    bottom      : 0
  },
  progressBar : {
    height         : 5,
    width          : '100%',
    backgroundColor: 'grey',
    borderRadius   : 5
  }
})