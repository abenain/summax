import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as React from 'react'
import { Image, View } from 'react-native'
import { OnboardingObjectivesScreen } from '../screens/onboarding/OnboardingObjectivesScreen'
import { OnboardingSexScreen } from '../screens/onboarding/OnboardingSexScreen'
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
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Constants.statusBarHeight + 56,
        },
        headerTitle           : HeaderTitle,
      }}>
      <Stack.Screen name="OnboardingSex" component={OnboardingSexScreen} options={{ headerBackImage: null }}/>
      <Stack.Screen name="OnboardingObjectives" component={OnboardingObjectivesScreen} options={{headerRight:() => <View style={{padding:6}}/>}}/>
    </Stack.Navigator>
  )
}