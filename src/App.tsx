import * as eva from '@eva-design/eva'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ApplicationProvider } from '@ui-kitten/components'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import React from 'react'
import en from '../assets/i18n/en'
import fr from '../assets/i18n/fr'
import { Home as HomeScreen } from './screens/Home'

i18n.fallbacks = true
i18n.translations = { fr, en }
i18n.locale = Localization.locale

export default () => {
  const Stack = createStackNavigator()

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Home'}
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name='Home' component={HomeScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  )
}
