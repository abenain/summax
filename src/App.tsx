import * as eva from '@eva-design/eva'
import { NavigationContainer } from '@react-navigation/native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as Font from 'expo-font'
import * as Localization from 'expo-localization'
import * as SplashScreen from 'expo-splash-screen'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Provider } from 'react-redux'
import en from '../assets/i18n/en'
import fr from '../assets/i18n/fr'
import { MainStackNavigator } from './navigation/MainStackNavigator'
import { getStore } from './redux/store'
import { performLoadHomepageSequence } from './sequences'

const MIN_SPLASH_SCREEN_DURATION_MS = 2000
const splashWithPeople = require('../assets/splash_with_people.png')

i18n.fallbacks = true
i18n.translations = { fr, en }
i18n.locale = Localization.locale

export type RootStackParamList = {
  Home: undefined
  Login: undefined
  Reward: undefined
  SignUp: undefined
  SignUpOtp: {
    id: string
  }
  Training: undefined
  Workout: {
    id: string
    title: string
  }
}

export default () => {
  const store = getStore()
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [homePageLoaded, setHomePageLoaded] = useState(false)

  useEffect(function componentDidMount() {
    SplashScreen.preventAutoHideAsync()
  }, [])

  function doLoadAssets() {
    return Font.loadAsync({
      aktivGroteskXBold: require('../assets/fonts/AktivGrotesk-XBold.otf'),
      nexaHeavy        : require('../assets/fonts/NexaHeavy.otf'),
      nexaRegular      : require('../assets/fonts/NexaRegular.otf'),
      nexaXBold        : require('../assets/fonts/Nexa-XBold.otf'),
    })
  }

  function tryToloadHomepage() {
    const maybeToken = store.getState().userData.accessToken

    return maybeToken.caseOf({
      just   : token => performLoadHomepageSequence({ token }),
      nothing: () => Promise.resolve()
    })
  }

  async function startLoadingAssets() {
    SplashScreen.hideAsync()

    setTimeout(() => setShowSplashScreen(false), MIN_SPLASH_SCREEN_DURATION_MS)

    await Promise.all([
      doLoadAssets().then(() => setAssetsLoaded(true)),
      tryToloadHomepage().then(() => setHomePageLoaded(true)),
    ])
  }

  if (!assetsLoaded || !homePageLoaded || showSplashScreen) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{ height: '100%', width: '100%' }}
          source={splashWithPeople}
          onLoad={startLoadingAssets}/>
      </View>
    )
  }

  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack}/>

      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <MainStackNavigator/>
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  )
}
