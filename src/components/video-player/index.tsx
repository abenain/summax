import { Layout } from '@ui-kitten/components'
import { Video } from 'expo-av'
import * as React from 'react'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
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

  useEffect(() => {
    onPlaybackStatusChanged(PlaybackStatus.PAUSED)

    if (videoPlayer.current) {
      videoPlayer.current.unloadAsync()
        .then(() => videoPlayer.current.setPositionAsync(0))
        .catch(console.log)
    }
  }, [currentPlaylistItem])

  useImperativeHandle(ref, () => ({
    stop: async () => {
      await videoPlayer.current.unloadAsync()
    }
  }))

  return (
    <Layout style={{
      backgroundColor: 'black',
      height: fullscreen ? Dimensions.get('window').height : height,
      width : fullscreen ? Dimensions.get('window').width : width,
    }}>
      <Video
        isLooping={true}
        isMuted={false}
        onLoad={async () => {
          onPlaybackStatusChanged(PlaybackStatus.PLAYING)
        }}
        rate={1.0}
        ref={videoPlayer}
        resizeMode={Video.RESIZE_MODE_CONTAIN}
        shouldPlay={true}
        source={{
          uri: videoUrl
        }}
        style={{
          height: fullscreen ? Dimensions.get('window').height : height,
          width : fullscreen ? Dimensions.get('window').width : width,
        }}
        useNativeControls={false}
        volume={1.0}
      />

      <Layout style={styles.controlsLayer}>
        <TouchableOpacity activeOpacity={.8} onPress={onFullscreenButtonPress}>
          <Image source={fullscreen ? exitFullscreenIcon : goFullscreenIcon} style={styles.fullscreenIcon}/>
        </TouchableOpacity>
      </Layout>

    </Layout>
  )
})

const styles = StyleSheet.create({
  controlsLayer : {
    backgroundColor: 'black',
    bottom         : 16,
    height         : 20,
    justifyContent : 'flex-end',
    flexDirection  : 'row',
    left           : 16,
    position       : 'absolute',
    right          : 16,
  },
  portraitControlsLayer: {
  },
  fullscreenIcon: {
    height: 16,
    width : 16,
  },
})