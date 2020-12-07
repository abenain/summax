import { Layout, Spinner, Text } from '@ui-kitten/components'
import { Audio, AVPlaybackStatus, Video } from 'expo-av'
import { INTERRUPTION_MODE_ANDROID_DO_NOT_MIX, INTERRUPTION_MODE_IOS_DO_NOT_MIX } from 'expo-av/build/Audio'
import * as React from 'react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Dimensions, Platform, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import * as Progress from 'react-native-progress'
import { Maybe } from 'tsmonad'
import { SummaxColors } from '../../colors'
import { Exercise } from '../../types'
import { getLargeSide, getSmallSide, NoOp } from '../../utils'
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
  currentPlaylistItemIndex: number
  fullscreen?: boolean
  height: number
  onFullscreenButtonPress?: () => void
  onPlaybackStatusChanged?: (status: PlaybackStatus) => void
  onPlayPauseButtonPress?: () => void
  playlist: Playlist
  showProgress?: boolean
  width: number
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(({
                                                                   currentPlaylistItemIndex,
                                                                   fullscreen,
                                                                   height,
                                                                   onFullscreenButtonPress = NoOp,
                                                                   onPlayPauseButtonPress = NoOp,
                                                                   onPlaybackStatusChanged = NoOp as any,
                                                                   playlist,
                                                                   showProgress = false,
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

  const getPlayerDimensions = useCallback(() => {
    if (!fullscreen) {
      return { height, width }
    }

    const windowDimensions = Dimensions.get('window')
    return {
      height: getSmallSide(windowDimensions),
      width : getLargeSide(windowDimensions),
    }
  }, [fullscreen, height, width])

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
          uri: getExerciseVideoUrl({ mediaId: playlist[currentPlaylistItemIndex].mediaId } as Exercise)
        }, {
          positionMillis: 0,
          shouldPlay    : true,
          isMuted       : false,
          isLooping     : true,
        }))
        .catch(console.log)
    }
  }, [currentPlaylistItemIndex])

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
    onPlayPauseButtonPress()
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
          height         : getPlayerDimensions().height,
          width          : getPlayerDimensions().width,
        }}>

        {fullscreen && (
          <StatusBar hidden={true}/>
        )}

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
              height: getPlayerDimensions().height,
              width : getPlayerDimensions().width,
            }}
            useNativeControls={false}
            volume={1.0}
          />
        )}

        {showProgress && (
          <Layout style={styles.progressContainer}>
            <Progress.Bar progress={Math.max(currentPlaylistItemIndex, 0) / playlist.length}
                          width={100} color={SummaxColors.lightishGreen}/>
            <Text
              style={[styles.progressText, { marginTop: 8, }]}>{Math.floor(Math.max(currentPlaylistItemIndex, 0) * 100 / playlist.length)}%</Text>
          </Layout>
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
  loadingContainer : {
    alignItems     : 'center',
    bottom         : 0,
    backgroundColor: 'transparent',
    justifyContent : 'center',
    left           : 0,
    position       : 'absolute',
    right          : 0,
    top            : 0,
  },
  progressContainer: {
    alignItems     : 'center',
    backgroundColor: 'transparent',
    position       : 'absolute',
    right          : 16,
    top            : 16,
    width          : 100,
  },
  progressText     : {
    color     : 'white',
    fontFamily: 'nexaXBold',
    fontSize  : 14,
  },
})