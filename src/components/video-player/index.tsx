import { Layout, Spinner } from '@ui-kitten/components'
import { Audio, AVPlaybackStatus, Video } from 'expo-av'
import { INTERRUPTION_MODE_ANDROID_DO_NOT_MIX, INTERRUPTION_MODE_IOS_DO_NOT_MIX } from 'expo-av/build/Audio'
import * as React from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Dimensions, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Maybe } from 'tsmonad'
import { Exercise } from '../../types'
import { NoOp } from '../../utils'
import { getExerciseVideoUrl } from '../../webservices/utils'
import { ControlBar } from './ControlBar'

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
  const [playlistLoaded, setPlaylistLoaded] = useState(false)
  const [videoStatus, setVideoStatus] = useState(PlaybackStatus.PAUSED)
  const [videoIsLoaded, setVideoIsLoaded] = useState(false)
  const [videoIsBuffering, setVideoIsBuffering] = useState(false)
  const [durationMs, setDurationMs] = useState(0)
  const [positionMs, setPositionMs] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const hideControlsTimeout = useRef<Maybe<number>>(Maybe.nothing())

  useEffect(() => {
    if (!playlistLoaded && playlist && playlist.length) {
      setPlaylistLoaded(true)
      Audio.setAudioModeAsync({
        interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        interruptionModeIOS    : INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      })
    }
  }, [playlist])

  useEffect(() => {
    onPlaybackStatusChanged(PlaybackStatus.PAUSED)
    setVideoStatus(PlaybackStatus.PAUSED)
    setVideoIsLoaded(false)
    setDurationMs(0)
    setPositionMs(0)

    if (videoPlayer.current) {
      videoPlayer.current.unloadAsync()
        .then(() => videoPlayer.current.loadAsync({
          uri: getExerciseVideoUrl({ mediaId: playlist[currentPlaylistItem].mediaId } as Exercise)
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

  function handlePlaybackStatusUpdate_ios(status: AVPlaybackStatus) {
    const newVideoStatus = (status.isLoaded && status.isPlaying && status.isBuffering === false) ? PlaybackStatus.PLAYING : PlaybackStatus.PAUSED

    setVideoIsLoaded(status.isLoaded)
    setVideoIsBuffering(status.isLoaded && status.isBuffering)
    setVideoStatus(newVideoStatus)
    setDurationMs(status.isLoaded ? status.durationMillis : 0)
    setPositionMs(status.isLoaded ? status.positionMillis : 0)
  }

  function handlePlaybackStatusUpdate_android(status: AVPlaybackStatus) {
    const durationMillis = status.isLoaded ? status.durationMillis : 0
    const positionMillis = status.isLoaded ? status.positionMillis : 0

    if (status.isLoaded) {
      setVideoIsLoaded(status.isLoaded)
    }
    setVideoIsBuffering(status.isLoaded && status.isBuffering)
    if (durationMillis) {
      setDurationMs(durationMillis)
    }
    if (positionMillis) {
      setPositionMs(positionMillis)
    }
  }

  function handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (Platform.OS === 'ios') {
      handlePlaybackStatusUpdate_ios(status)
    }

    if (Platform.OS === 'android') {
      handlePlaybackStatusUpdate_android(status)
    }
  }

  function handlePlayPauseButtonPress() {
    if (videoStatus === PlaybackStatus.PLAYING) {
      videoPlayer.current.pauseAsync()
      setVideoStatus(PlaybackStatus.PAUSED)
    } else {
      videoPlayer.current.playAsync()
      setVideoStatus(PlaybackStatus.PLAYING)
    }
  }

  useEffect(() => {
    onPlaybackStatusChanged(videoStatus)
  }, [videoStatus])

  function handlePress() {
    hideControlsTimeout.current.caseOf({
      just   : timeout => clearTimeout(timeout),
      nothing: () => {
      }
    })
    setShowControls(true)
    hideControlsTimeout.current = Maybe.just(setTimeout(() => setShowControls(false), 3000))
  }

  const videoIsPlaying = Platform.select({
    android: videoIsLoaded,
    ios    : videoIsLoaded && videoIsBuffering === false,
  })

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Layout
        style={{
          backgroundColor: 'black',
          height         : fullscreen ? Dimensions.get('window').height : height,
          width          : fullscreen ? Dimensions.get('window').width : width,
        }}>
        {playlistLoaded && (
          <Video
            isLooping={true}
            isMuted={false}
            onLoad={() => {
              setVideoIsLoaded(true)
              if (Platform.OS !== 'ios') {
                setVideoStatus(PlaybackStatus.PLAYING)
              }
            }}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            rate={1.0}
            ref={videoPlayer}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            shouldPlay={true}
            source={{
              uri: getExerciseVideoUrl({ mediaId: playlist[0].mediaId } as Exercise)
            }}
            style={{
              height: fullscreen ? Dimensions.get('window').height : height,
              width : fullscreen ? Dimensions.get('window').width : width,
            }}
            useNativeControls={false}
            volume={1.0}
          />
        )}

        <ControlBar
          disabled={videoIsPlaying === false}
          durationMs={durationMs}
          hideControls={showControls === false}
          isFullscreen={fullscreen}
          isPlaying={videoStatus === PlaybackStatus.PLAYING}
          onFullscreenButtonPress={onFullscreenButtonPress}
          onPlayPauseButtonPress={handlePlayPauseButtonPress}
          positionMs={positionMs}
        />

        {videoIsPlaying === false && (
          <Layout style={styles.loadingContainer}>
            <Spinner size='giant' status={'control'}/>
          </Layout>
        )}

      </Layout>
    </TouchableWithoutFeedback>
  )
})

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems     : 'center',
    bottom         : 0,
    backgroundColor: 'transparent',
    justifyContent : 'center',
    left           : 0,
    position       : 'absolute',
    right          : 0,
    top            : 0,
  },
})