import { Layout } from '@ui-kitten/components'
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { Loading } from '../../components/Loading'

export function TrainingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  if (isLoading) {
    return <Loading/>
  }

  return (
    <Layout style={{ alignItems: 'center', flex: 1 }}>
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: Video.RESIZE_MODE_CONTAIN,
          source    : {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        }}
        inFullscreen={false}
        height={233}
        width={Dimensions.get('window').width}
      />
    </Layout>
  )
}