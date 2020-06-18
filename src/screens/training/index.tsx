import { Layout, Text } from '@ui-kitten/components'
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import * as React from 'react'
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { ErrorPage } from '../../components/ErrorPage'
import { GlobalState } from '../../redux/store'

export function TrainingScreen() {
  const selectedWorkout = useSelector(({ uiState: { selectedWorkout } }: GlobalState) => selectedWorkout)

  return selectedWorkout.caseOf({
    just   : workout => (
      <Layout style={styles.mainContainer}>

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

        <SafeAreaView style={styles.safeContentsArea}>
          <Layout style={styles.contents}>

            <Layout style={{ marginTop: 47 }}>
              <Text style={styles.title}>{workout.title}</Text>
            </Layout>

          </Layout>
        </SafeAreaView>
      </Layout>
    ),
    nothing: () => <ErrorPage/>
  })
}

const styles = StyleSheet.create({
  mainContainer   : {
    alignItems: 'center',
    flex      : 1,
  },
  safeContentsArea: {
    alignSelf: 'stretch',
    flex     : 1,
  },
  contents        : {
    alignSelf        : 'stretch',
    flex             : 1,
    paddingHorizontal: 16,
  },
  title           : {
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 27,
  },
})