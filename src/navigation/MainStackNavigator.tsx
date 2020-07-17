import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, Platform, Text, View } from 'react-native'
import { LoginScreen } from '../screens/login'
import { OnboardingObjectivesScreen } from '../screens/onboarding/OnboardingObjectivesScreen'
import { OnboardingSexScreen } from '../screens/onboarding/OnboardingSexScreen'
import { ProfileScreen } from '../screens/profile'
import { ProfileObjectivesScreen } from '../screens/profile-objectives'
import { SignUpOtpScreen } from '../screens/sign-up-otp'
import { SignUpScreen } from '../screens/signup'
import { BottomTabNavigator } from './BottomTabNavigator'
import { ButtonsTint, RightButtons } from './header/RightButtons'
import { HeaderTitle } from './header/Title'

const arrowLeftIcon = require('../../assets/arrow-left-black.png')
const arrowLeftIconWhite = require('../../assets/arrow-left-white.png')

interface Props {
  initialRouteName: string
}

export function MainStackNavigator({ initialRouteName }: Props) {
  const Stack = createStackNavigator()

  const signUpScreensConfig = {
    headerBackImage  : () => (
      <View style={{ flexDirection: 'row' }}>
        <Image source={arrowLeftIconWhite}
               style={{ height: 24, marginHorizontal: 16, width: 24 }}/>
        <Text style={{ fontFamily: 'nexaXBold', fontSize: 18, lineHeight: 24, color: 'white' }}>{i18n.t('Back')}</Text>
      </View>
    ),
    headerRight      : null,
    headerTitle      : null,
    headerTransparent: true
  }

  const onboardingScreensConfig = {
    headerBackImage       : () => <Image source={arrowLeftIcon}
                                         style={{ height: 24, marginLeft: 16, width: 24 }}/>,
    headerBackTitleVisible: false,
    headerRight      : null,
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerBackImage       : () => <Image source={arrowLeftIcon}
                                             style={{ height: 24, marginLeft: 16, width: 24 }}/>,
        headerBackTitleVisible: false,
        headerStyle           : {
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: (Platform.OS === 'ios' ? Constants.statusBarHeight : 0) + 56,
        },
        headerTitle           : HeaderTitle,
        headerRight           : props => <RightButtons {...props} tint={ButtonsTint.DARK}/>,
      }}>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='SignUp' component={SignUpScreen} options={signUpScreensConfig}/>
      <Stack.Screen name='SignUpOtp' component={SignUpOtpScreen} options={signUpScreensConfig}/>
      <Stack.Screen name="OnboardingSex" component={OnboardingSexScreen} options={{ ...onboardingScreensConfig, headerBackImage: null }}/>
      <Stack.Screen name="OnboardingObjectives" component={OnboardingObjectivesScreen} options={{...onboardingScreensConfig, headerRight:() => <View style={{padding:6}}/>}}/>
      <Stack.Screen name='Home' component={BottomTabNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name='Profile' component={ProfileScreen}
                    options={{ headerRight: () => <View style={{ padding: 6 }}/> }}/>
      <Stack.Screen name='ProfileObjectives' component={ProfileObjectivesScreen} options={{ headerRight: null }}/>
    </Stack.Navigator>
  )
}