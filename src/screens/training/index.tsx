import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import { Subscription } from '@unimodules/core'
import { Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Orientation, OrientationChangeEvent, OrientationLock } from 'expo-screen-orientation'
import VideoPlayer from 'expo-video-player'
import i18n from 'i18n-js'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Maybe } from 'tsmonad'
import { RootStackParamList } from '../../App'
import { ErrorPage } from '../../components/ErrorPage'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { GlobalState } from '../../redux/store'
import { NoOp } from '../../utils'

const greenClockIcon = require('../../../assets/clock-green.png')
const nextIcon = require('./next.png')

export function TrainingScreen() {
  const navigation: StackNavigationProp<RootStackParamList, 'Training'> = useNavigation()
  const selectedWorkout = useSelector(({ uiState: { selectedWorkout } }: GlobalState) => selectedWorkout)
  const orientationChangedSubscription = useRef<Maybe<Subscription>>(Maybe.nothing())
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(function componentDidMount() {
    ScreenOrientation.unlockAsync()

    orientationChangedSubscription.current = Maybe.maybe(
      ScreenOrientation.addOrientationChangeListener(({ orientationInfo: { orientation } }: OrientationChangeEvent) => {
        if (orientation === Orientation.PORTRAIT_UP) {
          setIsFullScreen(false)
          return
        }

        setIsFullScreen(true)
      })
    )

    return function componentWillUnmount() {
      orientationChangedSubscription.current.caseOf({
        just   : subscription => {
          ScreenOrientation.removeOrientationChangeListener(subscription)
          orientationChangedSubscription.current = Maybe.nothing()
        },
        nothing: NoOp
      })

      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT_UP)
    }
  }, [])

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
          inFullscreen={isFullScreen}
          height={isFullScreen ? Dimensions.get('window').height : 233}
          width={Dimensions.get('window').width}
        />

        {isFullScreen === false && (
          <SafeAreaView style={styles.safeContentsArea}>
            <Layout style={styles.contents}>

              <ScrollView style={{ flex: 1 }}>

                <Layout style={styles.titleContainer}>
                  <Text style={styles.title}>{workout.title}</Text>
                </Layout>

                <Layout style={styles.controlsContainer}>

                  <SummaxButton
                    buttonStyle={ButtonStyle.WHITE}
                    style={styles.chronoRepControl}>
                    <Image
                      source={greenClockIcon}
                      style={styles.clockIcon}
                      resizeMode={'contain'}/>
                    <Text style={styles.controlsText}>1 : 30 : 27</Text>
                  </SummaxButton>

                  <SummaxButton
                    buttonStyle={ButtonStyle.GREEN}
                    style={styles.nextControl}
                    onPress={NoOp}>
                    <Image
                      source={nextIcon}
                      style={styles.nextIcon}
                      resizeMode={'contain'}/>
                    <Text style={[styles.controlsText, styles.nextText]}>{i18n.t('Training - Next exercise')}</Text>
                  </SummaxButton>
                </Layout>

              </ScrollView>

              <Layout style={styles.buttonContainer}>
                <SummaxButton
                  buttonStyle={ButtonStyle.GREEN}
                  text={i18n.t('Training - Quit training')}
                  onPress={() => navigation.popToTop()}
                />
              </Layout>

            </Layout>
          </SafeAreaView>
        )}
      </Layout>
    ),
    nothing: () => <ErrorPage/>
  })
}

const styles = StyleSheet.create({
  mainContainer    : {
    alignItems: 'center',
    flex      : 1,
  },
  safeContentsArea : {
    alignSelf: 'stretch',
    flex     : 1,
  },
  contents         : {
    alignSelf        : 'stretch',
    flex             : 1,
    paddingHorizontal: 16,
  },
  titleContainer   : {
    marginBottom: 36,
    marginTop   : 47,
  },
  title            : {
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 27,
  },
  controlsContainer: {
    flexDirection: 'row'
  },
  chronoRepControl : {
    borderBottomRightRadius: 0,
    borderTopRightRadius   : 0,
    height                 : 94,
    marginRight            : 0,
  },
  clockIcon        : {
    height      : 26,
    marginBottom: 8,
    width       : 26,
  },
  controlsText        : {
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 27,
  },
  nextControl      : {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius   : 0,
    height                : 94,
  },
  nextIcon         : {
    height      : 28,
    marginBottom: 8,
    width       : 36,
  },
  nextText: {
    color: 'white'
  },
  buttonContainer  : {
    marginTop: 33,
    height   : 56,
  },
})