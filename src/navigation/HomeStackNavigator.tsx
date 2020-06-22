import { createStackNavigator, StackHeaderTitleProps } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as React from 'react'
import { Image, Platform } from 'react-native'
import { HeaderTitle } from '../components/header-title'
import { HomeScreen } from '../screens/home'
import { RewardScreen } from '../screens/reward'
import { TrainingScreen } from '../screens/training'
import { WorkoutScreen } from '../screens/workout'

const arrowLeftIcon = require('../../assets/arrow-left.png')

export function HomeStackNavigator() {
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
      }}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name='Reward' component={RewardScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Workout'
                    component={WorkoutScreen}
                    options={({ route }) => ({
                      headerTitle      : (props: StackHeaderTitleProps) => <HeaderTitle
                        title={route.params['title']} {...props}/>,
                      headerTransparent: true,
                    })}
      />
      <Stack.Screen name='Training' component={TrainingScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}