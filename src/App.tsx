import * as eva from '@eva-design/eva'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Constants from 'expo-constants'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import React from 'react'
import { Provider } from 'react-redux'
import en from '../assets/i18n/en'
import fr from '../assets/i18n/fr'
import { HeaderTitle } from './components/header-title'
import { getStore } from './redux/store'
import { Home as HomeScreen } from './screens/home'
import { Login as LoginScreen } from './screens/login'
import { SignUp as SignUpScreen } from './screens/signup'

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
                height: Constants.statusBarHeight + 56,
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
