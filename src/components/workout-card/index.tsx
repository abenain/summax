import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { SummaxColors } from '../../colors'
import { Workout, WorkoutPlan } from '../../types'
import { NoOp, PosterAspectRatio } from '../../utils'
import { Duration, Size as DurationSize } from '../duration'
import { Intensity, Size as IntensitySize } from '../intensity'

const plusIcon = require('../../../assets/plus-circle.png')
const checkIcon = require('../../../assets/check-circle.png')
const playIcon = require('./play.png')

export enum Style {
  THEME,
  WORKOUT_LARGE,
  WORKOUT_SMALL,
}

interface Props {
  cardStyle: Style
  showPlayButton?: boolean
  onPress?: () => void
  onToggleFavorite?: (favorite: boolean) => void
  style?: ViewStyle
  themeOrWorkout: Partial<Workout>
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

export function WorkoutCard({ cardStyle, onPress = NoOp, onToggleFavorite = NoOp, showPlayButton = false, style = {}, themeOrWorkout }: Props) {
  return (
    <TouchableOpacity style={[getCardSize(cardStyle), style]} activeOpacity={.8} onPress={onPress}>
      <ImageBackground source={{ uri: themeOrWorkout.posterUrl }} style={[styles.poster, getCardSize(cardStyle)]}
                       imageStyle={{ borderRadius: 4, resizeMode: 'stretch' }}>
        <Layout style={styles.posterContents}>

          {cardStyle !== Style.THEME && themeOrWorkout.plan === WorkoutPlan.PREMIUM && (
            <Layout style={styles.premiumLabelContainer}>
              <Text style={styles.premiumLabelText}>{i18n.t('Workout - Premium').toUpperCase()}</Text>
            </Layout>
          )}

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
              showPlayButton ? (
                <Image source={playIcon} style={styles.playIcon}/>
              ) : (
                <TouchableOpacity onPress={() => onToggleFavorite(!themeOrWorkout.favorite)} activeOpacity={.5}>
                  <Image source={themeOrWorkout.favorite ? checkIcon : plusIcon} style={styles.plusIcon}/>
                </TouchableOpacity>
              )
            )}
          </Layout>

        </Layout>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  poster               : {
    borderRadius: 4,
  },
  posterContents       : {
    position       : 'absolute',
    top            : 16,
    bottom         : 16,
    left           : 16,
    right          : 16,
    backgroundColor: 'transparent',
  },
  posterFiller         : {
    flex           : 1,
    backgroundColor: 'transparent',
  },
  title                : {
    color     : 'white',
    flex      : 1,
    fontFamily: 'nexaHeavy',
    fontSize  : 24,
  },
  plusIcon             : {
    height: 30,
    width : 30,
  },
  playIcon             : {
    bottom  : 0,
    height  : 69,
    position: 'absolute',
    right   : 0,
    width   : 69,
  },
  featuresContainer    : {
    flexDirection  : 'row',
    backgroundColor: 'transparent',
    marginBottom   : 8,
  },
  footerContainer      : {
    flexDirection  : 'row',
    backgroundColor: 'transparent',
    alignItems     : 'center',
  },
  premiumLabelContainer: {
    alignItems     : 'center',
    backgroundColor: SummaxColors.lightishGreen,
    borderRadius   : 30,
    height         : 23,
    justifyContent : 'center',
    width          : 76,
  },
  premiumLabelText     : {
    color     : 'white',
    fontFamily: 'nexaHeavy',
    fontSize  : 11,
  },
})