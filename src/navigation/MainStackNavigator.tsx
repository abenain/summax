import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as React from 'react'
import { Image, Platform } from 'react-native'
import { LoginScreen } from '../screens/login'
import { ProfileScreen } from '../screens/profile'
import { SignUpScreen } from '../screens/signup'
import { BottomTabNavigator } from './BottomTabNavigator'
import { RightButtons } from './header/RightButtons'
import { HeaderTitle } from './header/Title'

const arrowLeftIcon = require('../../assets/arrow-left-black.png')

export function MainStackNavigator() {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerBackImage       : () => <Image source={arrowLeftIcon}
                                             style={{ height: 24, marginLeft: 16, width: 24 }}/>,
        headerBackTitleVisible: false,
        headerStyle           : {
          height: (Platform.OS === 'ios' ? Constants.statusBarHeight : 0) + 56,
        },
        headerTitle           : HeaderTitle,
        headerRight           : props => <RightButtons {...props}/>,
      }}>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Home' component={BottomTabNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name='Profile' component={ProfileScreen}/>
    </Stack.Navigator>
  )
}