import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { SummaxColors } from '../../colors'
import { Duration, Size as DurationSize } from '../../components/duration'
import { Intensity, Size as IntensitySize } from '../../components/intensity'
import { HomePageWorkout } from '../../types'
import { NoOp } from '../../utils'

const play = require('./play.png')

interface Props {
  onPress?: () => void
  workout: HomePageWorkout
}

export function FeaturedWorkout({ onPress = NoOp, workout }: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={.8} onPress={onPress}>

      <Layout style={styles.background}/>

      <ImageBackground source={workout.poster} style={styles.poster}
                       imageStyle={{ borderRadius: 5, resizeMode: 'stretch' }}>
        <Layout style={styles.posterContents}>

          <Text style={[styles.posterText, styles.posterTitle, { marginBottom: 16 }]}>{workout.title}</Text>
          <Text style={[styles.posterText, styles.posterSubTitle]}>{workout.subtitle}</Text>

          <Layout style={styles.posterFiller}>
            <Image source={play} style={styles.play}/>
          </Layout>

          <Layout style={styles.footer}>
            <Intensity level={workout.intensity} size={IntensitySize.LARGE} style={{ marginRight: 16 }}/>
            <Duration durationMin={workout.durationMin} size={DurationSize.LARGE}/>
          </Layout>

        </Layout>
      </ImageBackground>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container     : {
    alignItems       : 'center',
    marginBottom     : 32,
    paddingHorizontal: 16,
  },
  background    : {
    position       : 'absolute',
    top            : 69 + 16,
    left           : 0,
    right          : 0,
    height         : 349,
    backgroundColor: SummaxColors.lightishGreen,
  },
  poster        : {
    height      : 487,
    width       : '100%',
    borderRadius: 5,
  },
  posterContents: {
    position       : 'absolute',
    top            : 24,
    bottom         : 24,
    left           : 16,
    right          : 16,
    backgroundColor: 'transparent',
  },
  posterText    : {
    color: 'white'
  },
  posterTitle   : {
    fontFamily: 'nexaHeavy',
    fontSize  : 24,
  },
  posterSubTitle: {
    fontFamily: 'nexaRegular',
    fontSize  : 12,
  },
  posterFiller  : {
    flex           : 1,
    justifyContent : 'center',
    alignItems     : 'center',
    backgroundColor: 'transparent',
  },
  play          : {
    width : 140,
    height: 140,
  },
  footer        : {
    flexDirection  : 'row',
    backgroundColor: 'transparent',
  }
})