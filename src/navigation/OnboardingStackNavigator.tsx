import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as React from 'react'
import { Image, Platform } from 'react-native'
import { OnboardingSexScreen } from '../screens/onboarding/OnboardingSexScreen'
import { OnboardingTargetScreen } from '../screens/onboarding/OnboardingTargetScreen'
import { HeaderTitle } from './header/Title'

const arrowLeftIcon = require('../../assets/arrow-left-black.png')

export function OnboardingStackNavigator() {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={'OnboardingSex'}
      screenOptions={{
        headerBackImage       : () => <Image source={arrowLeftIcon}
                                             style={{ height: 24, marginLeft: 16, width: 24 }}/>,
        headerBackTitleVisible: false,
        headerStyle           : {
          height: (Platform.OS === 'ios' ? Constants.statusBarHeight : 0) + 56,
        },
        headerTitle           : HeaderTitle,
      }}>
      <Stack.Screen name="OnboardingSex" component={OnboardingSexScreen} options={{ headerBackImage: null }}/>
      <Stack.Screen name="OnboardingTarget" component={OnboardingTargetScreen}/>
    </Stack.Navigator>
  )
}