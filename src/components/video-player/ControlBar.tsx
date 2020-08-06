import { Layout, Text } from '@ui-kitten/components'
import moment from 'moment'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { NoOp } from '../../utils'
import { ProgressBar } from './ProgressBar'

const exitFullscreenIcon = require('./exitFullscreen.png')
const goFullscreenIcon = require('./goFullscreen.png')
const playIcon = require('./play.png')
const pauseIcon = require('./pause.png')

interface Props {
  disabled?: boolean
  durationMs?: number
  hideControls?: boolean
  isFullscreen: boolean
  isPlaying: boolean
  onFullscreenButtonPress?: () => void
  onPlayPauseButtonPress?: () => void
  positionMs?: number
}

function formatDuration(durationMs: number) {
  const duration = moment.duration(durationMs)
  return `${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`
}

export function ControlBar({ disabled = false, durationMs = 0, hideControls = false, isFullscreen, isPlaying, onFullscreenButtonPress = NoOp, onPlayPauseButtonPress = NoOp, positionMs = 0}: Props) {
  return (
    <Layout style={styles.controlsLayer}>

      {hideControls === false && (
        <Layout style={styles.innerContainer}>
          <TouchableOpacity
            activeOpacity={.8}
            disabled={disabled}
            onPress={onPlayPauseButtonPress}
            style={[styles.button, styles.playPauseButton]}
          >
            <Image source={isPlaying ? pauseIcon : playIcon} style={styles.playPauseIcon}/>
          </TouchableOpacity>

          <Text style={styles.timelineText}>{formatDuration(positionMs)}</Text>

          <Layout style={styles.timeline}>
            <ProgressBar progress={durationMs ? positionMs * 100 / durationMs : 0}/>
          </Layout>

          <Text style={styles.timelineText}>{formatDuration(durationMs)}</Text>

          <TouchableOpacity
            activeOpacity={.8}
            onPress={onFullscreenButtonPress}
            style={[styles.button, styles.fullscreenButton]}
          >
            <Image source={isFullscreen ? exitFullscreenIcon : goFullscreenIcon} style={styles.fullscreenIcon}/>
          </TouchableOpacity>
        </Layout>
      )}

    </Layout>
  )
}

const styles = StyleSheet.create({
  controlsLayer   : {
    backgroundColor: 'black',
    bottom         : 16,
    height         : 20,
    left           : 16,
    position       : 'absolute',
    right          : 16,
  },
  innerContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection  : 'row',
    width: '100%',
  },
  button          : {
    height: 20,
    width : 32,
  },
  fullscreenButton: {
    paddingHorizontal: 8,
    paddingVertical  : 2,
    marginLeft       : 14,
  },
  fullscreenIcon  : {
    height: 16,
    width : 16,
  },
  playPauseButton : {
    marginRight      : 16,
    paddingHorizontal: 6,
  },
  playPauseIcon   : {
    height: 20,
    width : 20,
  },
  timelineText    : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 12,
    lineHeight: 20,
  },
  timeline        : {
    alignSelf      : 'center',
    backgroundColor: 'transparent',
    flex           : 1,
    marginLeft     : 13,
    marginRight    : 16,
  },
})