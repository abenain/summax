import { Icon, Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Dimensions, ImageBackground, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { HomePageWorkout } from '../../types'
import { NoOp, PosterAspectRatio } from '../../utils'
import { Duration, Size as DurationSize } from '../duration'
import { Intensity, Size as IntensitySize } from '../intensity'

export enum Style {
  THEME,
  WORKOUT_LARGE,
  WORKOUT_SMALL,
}

interface Props {
  onPress?: () => void
  onToggleFavorite?: () => void
  cardStyle: Style
  style?: ViewStyle
  themeOrWorkout: Partial<HomePageWorkout>
}

const { width: screenWidth } = Dimensions.get('window')

function getCardSize(style: Style) {
  switch (style) {
    case Style.WORKOUT_SMALL:
    case Style.THEME:
      return {
        height: Math.round(275 * PosterAspectRatio.workoutCard),
        width : 275,
      }
    case Style.WORKOUT_LARGE:
      return {
        height: Math.round((screenWidth - 32) * PosterAspectRatio.workoutCard),
        width : screenWidth - 32,
      }
    default:
      return {}
  }
}

export function WorkoutCard({ cardStyle, onPress = NoOp, onToggleFavorite = NoOp, style = {}, themeOrWorkout }: Props) {
  return (
    <TouchableOpacity style={[getCardSize(cardStyle), style]} activeOpacity={.8} onPress={onPress}>
      <ImageBackground source={{ uri: themeOrWorkout.posterUrl }} style={[styles.poster, getCardSize(cardStyle)]}
                       imageStyle={{ borderRadius: 5, resizeMode: 'stretch' }}>
        <Layout style={styles.posterContents}>

          <Layout style={styles.posterFiller}/>

          {cardStyle !== Style.THEME && (
            <Layout style={styles.featuresContainer}>
              <Intensity level={themeOrWorkout.intensity} size={IntensitySize.SMALL} style={{ marginRight: 24 }}/>
              <Duration durationMin={themeOrWorkout.durationMin} size={DurationSize.SMALL}/>
            </Layout>
          )}

          <Layout style={styles.footerContainer}>
            <Text style={styles.title}>{themeOrWorkout.title}</Text>
            {cardStyle !== Style.THEME && (
              <TouchableOpacity onPress={onToggleFavorite} activeOpacity={.5}>
                <Icon name={'plus-circle-outline'} style={styles.plusIcon} fill={'white'}/>
              </TouchableOpacity>
            )}
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
    color     : 'white',
    flex      : 1,
    fontFamily: 'nexaHeavy',
    fontSize  : 24,
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