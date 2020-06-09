import { Icon, Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { ImageBackground, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { Workout } from '../../types'
import { Duration, Size as DurationSize } from '../duration'
import { Intensity, Size as IntensitySize } from '../intensity'

export enum Size {
  SMALL,
  LARGE,
  WIDE,
}

interface Props {
  onPress?: () => void
  onToggleFavorite?: () => void
  size: Size
  style?: ViewStyle
  workout: Workout
}

function getCardSize(size: Size) {
  switch (size) {
    case Size.SMALL:
      return {
        height: 160,
        width : 275,
      }
    case Size.LARGE:
      return {
        height: 200,
        width : '100%',
      }
    case Size.WIDE:
      return {
        height: 168,
        width : '100%',
      }
    default:
      return {}
  }
}

export function WorkoutCard({ onPress = () => {}, onToggleFavorite = () => {}, size, style = {}, workout }: Props) {
  return (
    <TouchableOpacity style={[getCardSize(size), style]} activeOpacity={.8} onPress={onPress}>
      <ImageBackground source={workout.poster} style={[styles.poster, getCardSize(size)]}
                       imageStyle={{ borderRadius: 5 }}>
        <Layout style={styles.posterContents}>

          <Layout style={styles.posterFiller}/>

          <Layout style={styles.featuresContainer}>
            <Intensity level={workout.intensity} size={IntensitySize.SMALL} style={{ marginRight: 24 }}/>
            <Duration durationMin={workout.durationMin} size={DurationSize.SMALL}/>
          </Layout>

          <Layout style={styles.footerContainer}>
            <Text category={'h4'} style={styles.title}>{workout.title}</Text>
            <TouchableOpacity onPress={onToggleFavorite} activeOpacity={.5}>
              <Icon name={'plus-circle-outline'} style={styles.plusIcon} fill={'white'}/>
            </TouchableOpacity>
          </Layout>

        </Layout>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  poster           : {
    borderRadius: 5,
  },
  posterContents   : {
    position       : 'absolute',
    top            : 16,
    bottom         : 16,
    left           : 16,
    right          : 16,
    backgroundColor: 'transparent',
  },
  posterFiller     : {
    flex           : 1,
    backgroundColor: 'transparent',
  },
  title            : {
    color: 'white',
    flex : 1,
  },
  plusIcon         : {
    height: 40,
    width : 40,
  },
  featuresContainer: {
    flexDirection  : 'row',
    backgroundColor: 'transparent',
    marginBottom   : 8,
  },
  footerContainer  : {
    flexDirection  : 'row',
    backgroundColor: 'transparent',
    alignItems     : 'center',
  },
})