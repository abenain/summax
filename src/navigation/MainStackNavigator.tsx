import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as React from 'react'
import { Image, Platform, Text, View } from 'react-native'
import { LoginScreen } from '../screens/login'
import { ProfileScreen } from '../screens/profile'
import { ProfileObjectivesScreen } from '../screens/profile-objectives'
import { SignUpOtpScreen } from '../screens/sign-up-otp'
import { SignUpScreen } from '../screens/signup'
import { BottomTabNavigator } from './BottomTabNavigator'
import { ButtonsTint, RightButtons } from './header/RightButtons'
import { HeaderTitle } from './header/Title'
import { OnboardingStackNavigator } from './OnboardingStackNavigator'

const arrowLeftIcon = require('../../assets/arrow-left-black.png')
const arrowLeftIconWhite = require('../../assets/arrow-left-white.png')

export function MainStackNavigator() {
  const Stack = createStackNavigator()

  const signUpScreensHeaderConfig = {
    headerBackImage  : () => (
      <View style={{ flexDirection: 'row' }}>
        <Image source={arrowLeftIconWhite}
               style={{ height: 24, marginHorizontal: 16, width: 24 }}/>
        <Text style={{ fontFamily: 'nexaXBold', fontSize: 18, lineHeight: 24, color: 'white' }}>Retour</Text>
      </View>
    ),
    headerRight      : null,
    headerTitle      : null,
    headerTransparent: true
  }

  return (
    <Stack.Navigator
      initialRouteName={'Login'}
      screenOptions={{
        headerBackImage       : () => <Image source={arrowLeftIcon}
                                             style={{ height: 24, marginLeft: 16, width: 24 }}/>,
        headerBackTitleVisible: false,
        headerStyle           : {
          height: (Platform.OS === 'ios' ? Constants.statusBarHeight : 0) + 56,
        },
        headerTitle           : HeaderTitle,
        headerRight           : props => <RightButtons {...props} tint={ButtonsTint.DARK}/>,
      }}>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='SignUp' component={SignUpScreen} options={signUpScreensHeaderConfig}/>
      <Stack.Screen name='SignUpOtp' component={SignUpOtpScreen} options={signUpScreensHeaderConfig}/>
      <Stack.Screen name='Onboarding' component={OnboardingStackNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name='Home' component={BottomTabNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name='Profile' component={ProfileScreen} options={{headerRight: null}}/>
      <Stack.Screen name='ProfileObjectives' component={ProfileObjectivesScreen} options={{headerRight: null}}/>
    </Stack.Navigator>
  )
}