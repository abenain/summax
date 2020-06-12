import * as eva from '@eva-design/eva'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Constants from 'expo-constants'
import * as Font from 'expo-font'
import * as Localization from 'expo-localization'
import * as SplashScreen from 'expo-splash-screen'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { Image, Platform, View } from 'react-native'
import { Provider } from 'react-redux'
import en from '../assets/i18n/en'
import fr from '../assets/i18n/fr'
import { HeaderTitle } from './components/header-title'
import { ActionType } from './redux/actions'
import { getStore } from './redux/store'
import { Home as HomeScreen } from './screens/home'
import { Login as LoginScreen } from './screens/login'
import { SignUp as SignUpScreen } from './screens/signup'
import * as Homepage from './webservices/homepage'

const MIN_SPLASH_SCREEN_DURATION_MS = 2000
const splashWithPeople = require('../assets/splash_with_people.png')

i18n.fallbacks = true
i18n.translations = { fr, en }
i18n.locale = Localization.locale

export type RootStackParamList = {
  Home: undefined
  Login: undefined
  SignUp: undefined
}

export default () => {
  const Stack = createStackNavigator()
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

  function loadHomepage() {
    return Homepage.load()
      .then(homepage => store.dispatch({
        type: ActionType.LOADED_HOMEPAGE,
        homepage,
      }))
  }

  async function startLoadingAssets() {
    SplashScreen.hideAsync()

    setTimeout(() => setShowSplashScreen(false), MIN_SPLASH_SCREEN_DURATION_MS)

    await Promise.all([
      doLoadAssets().then(() => setAssetsLoaded(true)),
      loadHomepage().then(() => setHomePageLoaded(true)),
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
          <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{
              headerTitle: HeaderTitle,
              headerStyle: {
                height: (Platform.OS === 'ios' ? Constants.statusBarHeight : 0) + 56,
              }
            }}>
            <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
            <Stack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }}/>
            <Stack.Screen name='Home' component={HomeScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  )
}
