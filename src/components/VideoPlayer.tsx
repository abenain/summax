import { Layout } from '@ui-kitten/components'
import { Video } from 'expo-av'
import * as React from 'react'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { NoOp } from '../utils'
import { getExerciseVideoUrl } from '../webservices/utils'

interface PlaylistItem {
  mediaId: string
}

type Playlist = PlaylistItem[]

export enum PlaybackStatus {
  PLAYING,
  PAUSED,
}

interface VideoPlayerHandle {
  unloadAsync: () => Promise<void>
}

interface Props {
  currentPlaylistItem: number
  height: number
  onPlaybackStatusChanged?: (status: PlaybackStatus) => void
  playlist: Playlist
  width: number
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(({ currentPlaylistItem, height, onPlaybackStatusChanged = NoOp as any, playlist, width }, ref) => {
  const videoPlayer = useRef<Video>()
  const videoUrl = useMemo(() => {
    if (currentPlaylistItem < 0 || currentPlaylistItem >= playlist.length) {
      return null
    }

    onPlaybackStatusChanged(PlaybackStatus.PAUSED)

    return getExerciseVideoUrl({ mediaId: playlist[currentPlaylistItem].mediaId })
  }, [currentPlaylistItem])

  useImperativeHandle(ref, () => ({
    unloadAsync: async () => {
      await videoPlayer.current.unloadAsync()
    }
  }))

  return (
    <Layout style={{
      backgroundColor: 'black',
      height,
      width,
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
          height,
          width
        }}
        useNativeControls={false}
        volume={1.0}
      />
    </Layout>
  )
})

const styles = StyleSheet.create({})