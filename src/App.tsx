import * as eva from '@eva-design/eva'
import { NavigationContainer } from '@react-navigation/native'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as Amplitude from 'expo-analytics-amplitude'
import * as Font from 'expo-font'
import * as Localization from 'expo-localization'
import * as SplashScreen from 'expo-splash-screen'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Provider } from 'react-redux'
import en from '../assets/i18n/en'
import fr from '../assets/i18n/fr'
import { getAmplitudeApiKey } from './amplitude'
import useLogoutListener from './hooks/logout-listener'
import { MainStackNavigator } from './navigation/MainStackNavigator'
import { getHydrationPromise, getStore } from './redux/store'
import { fetchHomepageSequence, fetchUserDataSequence } from './sequences'
import { AntDesign, Entypo } from '@expo/vector-icons'

const MIN_SPLASH_SCREEN_DURATION_MS = 2000
const splashWithPeople = require('../assets/splash_with_people.png')

i18n.fallbacks = true
i18n.translations = { fr, en }
i18n.locale = Localization.locale

export type RootStackParamList = {
  Filter: {
    subfilter?: string
    title?: string
    type: string
    value: string | number
  }
  ForgotPassword: {
    email?: string
  }
  ForgotPasswordOtp: {
    email?: string
  }
  Home: undefined
  Login: undefined
  OnboardingSex: undefined
  OnboardingObjectives: undefined
  Reward: undefined
  SignUp: undefined
  SignUpOtp: {
    id: string
  }
  Training: {
    warmup?: boolean
    startAtExercise?: number
  }
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
  const [userDataLoaded, setUserDataLoaded] = useState(false)
  const [logoutKey, setLogoutKey] = useState(new Date().toISOString())

  useLogoutListener(function onLogout() {
    setLogoutKey(new Date().toISOString())
  })

  useEffect(function componentDidMount() {
    SplashScreen.preventAutoHideAsync()
  }, [])

  function doLoadAssets() {
    return Promise.all([
      Font.loadAsync({
        aktivGroteskXBold: require('../assets/fonts/AktivGrotesk-XBold.otf'),
        nexaHeavy        : require('../assets/fonts/NexaHeavy.otf'),
        nexaRegular      : require('../assets/fonts/NexaRegular.otf'),
        nexaXBold        : require('../assets/fonts/Nexa-XBold.otf'),
        ...AntDesign.font,
        ...Entypo.font,
      }),
      getHydrationPromise(),
      Amplitude.initialize(getAmplitudeApiKey()),
    ])
  }

  function tryFetchingHomepage() {
    const maybeToken = store.getState().userData.accessToken

    return maybeToken.caseOf({
      just   : () => fetchHomepageSequence(),
      nothing: () => Promise.resolve()
    })
  }

  function tryFetchingUserData() {
    const maybeToken = store.getState().userData.accessToken

    return maybeToken.caseOf({
      just   : () => fetchUserDataSequence(),
      nothing: () => Promise.resolve()
    })
  }

  async function startLoadingAssets() {
    SplashScreen.hideAsync()

    setTimeout(() => setShowSplashScreen(false), MIN_SPLASH_SCREEN_DURATION_MS)

    await Promise.all([
      doLoadAssets().then(() => setAssetsLoaded(true)),
      tryFetchingHomepage().then(() => setHomePageLoaded(true)),
      tryFetchingUserData().then(() => setUserDataLoaded(true)),
    ])
  }

  if (!assetsLoaded || !homePageLoaded || !userDataLoaded || showSplashScreen) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{ height: '100%', width: '100%' }}
          source={splashWithPeople}
          onLoad={startLoadingAssets}/>
      </View>
    )
  }

  function getInitialRouteName() {
    return store.getState().userData.accessToken.caseOf({
      just   : () => {
        return store.getState().userData.user.caseOf({
          just   : user => {
            if(!user.weightKg || !user.heightCm){
              return 'OnboardingSex'
            }

            if(!user.objectives || user.objectives.length === 0){
              return 'OnboardingObjectives'
            }

            if(!user.sportSkills || !user.planningIntensity){
              return 'OnboardingSkillsAndPlanning'
            }

            return 'Home'
          },
          nothing: () => 'Login'
        })
      },
      nothing: () => 'Login'
    })
  }

  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack}/>

      <ApplicationProvider {...eva} theme={eva.light} key={logoutKey}>
        <NavigationContainer>
          <MainStackNavigator initialRouteName={getInitialRouteName()}/>
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  )
}
