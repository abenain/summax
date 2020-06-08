import * as eva from '@eva-design/eva'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import React from 'react'
import en from '../assets/i18n/en'
import fr from '../assets/i18n/fr'
import { Login as LoginScreen } from './screens/login'

i18n.fallbacks = true
i18n.translations = { fr, en }
i18n.locale = Localization.locale

export default () => {
  const Stack = createStackNavigator()

  return (
    <>
      <IconRegistry icons={EvaIconsPack}/>

      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={'Login'}
            screenOptions={{
              headerShown: false
            }}>
            <Stack.Screen name='Login' component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  )
}
