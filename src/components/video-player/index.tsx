import { Layout, Text } from '@ui-kitten/components'
import { AVPlaybackStatus, Video } from 'expo-av'
import moment from 'moment'
import * as React from 'react'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { NoOp } from '../../utils'
import { getExerciseVideoUrl } from '../../webservices/utils'

const exitFullscreenIcon = require('./exitFullscreen.png')
const goFullscreenIcon = require('./goFullscreen.png')

interface PlaylistItem {
  mediaId: string
}

type Playlist = PlaylistItem[]

export enum PlaybackStatus {
  PLAYING,
  PAUSED,
}

export interface VideoPlayerHandle {
  stop: () => Promise<void>
}

interface Props {
  currentPlaylistItem: number
  fullscreen?: boolean
  height: number
  onFullscreenButtonPress?: () => void
  onPlaybackStatusChanged?: (status: PlaybackStatus) => void
  playlist: Playlist
  width: number
}

function formatDuration(durationMs: number) {
  const duration = moment.duration(durationMs)
  return `${duration.minutes().toString().padStart(2, '0')}:${duration.seconds().toString().padStart(2, '0')}`
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(({
                                                                   currentPlaylistItem,
                                                                   fullscreen,
                                                                   height,
                                                                   onFullscreenButtonPress = NoOp,
                                                                   onPlaybackStatusChanged = NoOp as any,
                                                                   playlist,
                                                                   width
                                                                 }, ref) => {
  const videoPlayer = useRef<Video>()
  const videoUrl = useMemo(() => {
    if (currentPlaylistItem < 0 || currentPlaylistItem >= playlist.length) {
      return null
    }

    return getExerciseVideoUrl({ mediaId: playlist[currentPlaylistItem].mediaId })
  }, [currentPlaylistItem])
  const [isPlaying, setIsPlaying] = useState(false)
  const [durationMs, setDurationMs] = useState(0)
  const [positionMs, setPositionMs] = useState(0)

  useEffect(() => {
    onPlaybackStatusChanged(PlaybackStatus.PAUSED)

    if (videoPlayer.current) {
      videoPlayer.current.unloadAsync()
        .then(() => videoPlayer.current.loadAsync({
          uri: videoUrl
        }, {
          positionMillis: 0,
          shouldPlay    : true,
          isMuted       : false,
          isLooping     : true,
        }))
        .catch(console.log)
    }
  }, [currentPlaylistItem])

  useImperativeHandle(ref, () => ({
    stop: async () => {
      await videoPlayer.current.unloadAsync()
    }
  }))

  function handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
    const videoIsPlaying = status.isLoaded && status.isPlaying && status.isBuffering === false
    const durationMillis = status.isLoaded ? status.durationMillis : 0
    const positionMillis = status.isLoaded ? status.positionMillis : 0

    setIsPlaying(videoIsPlaying)
    setDurationMs(durationMillis)
    setPositionMs(positionMillis)
  }

  useEffect(() => {
    onPlaybackStatusChanged(isPlaying ? PlaybackStatus.PLAYING : PlaybackStatus.PAUSED)
  }, [isPlaying])

  return (
    <Layout style={{
      backgroundColor: 'black',
      height         : fullscreen ? Dimensions.get('window').height : height,
      width          : fullscreen ? Dimensions.get('window').width : width,
    }}>
      <Video
        isLooping={true}
        isMuted={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        rate={1.0}
        ref={videoPlayer}
        resizeMode={Video.RESIZE_MODE_CONTAIN}
        shouldPlay={true}
        source={{
          uri: getExerciseVideoUrl({ mediaId: playlist[0].mediaId })
        }}
        style={{
          height: fullscreen ? Dimensions.get('window').height : height,
          width : fullscreen ? Dimensions.get('window').width : width,
        }}
        useNativeControls={false}
        volume={1.0}
      />

      <Layout style={styles.controlsLayer}>

        <Text style={styles.timelineText}>{formatDuration(positionMs)}</Text>

        <Layout style={styles.timeline}/>

        <Text style={styles.timelineText}>{formatDuration(durationMs)}</Text>

        <TouchableOpacity activeOpacity={.8} onPress={onFullscreenButtonPress} style={styles.fullscreenButton}>
          <Image source={fullscreen ? exitFullscreenIcon : goFullscreenIcon} style={styles.fullscreenIcon}/>
        </TouchableOpacity>

      </Layout>

    </Layout>
  )
})

const styles = StyleSheet.create({
  controlsLayer        : {
    backgroundColor: 'black',
    bottom         : 16,
    height         : 20,
    flexDirection  : 'row',
    left           : 16,
    position       : 'absolute',
    right          : 16,
  },
  fullscreenButton     : {
    height : 20,
    marginLeft: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width  : 32,
  },
  fullscreenIcon       : {
    height: 16,
    width : 16,
  },
  timelineText         : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 12,
    lineHeight: 20,
  },
  timeline             : {
    backgroundColor: 'transparent',
    flex           : 1,
    marginLeft     : 13,
    marginRight    : 16,
  },
})