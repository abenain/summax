import { createStackNavigator, StackHeaderTitleProps } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as React from 'react'
import { Image, Platform, View } from 'react-native'
import { HomeScreen } from '../screens/home'
import { RewardScreen } from '../screens/reward'
import { TrainingScreen } from '../screens/training'
import { WorkoutScreen } from '../screens/workout'
import { ButtonsTint, RightButtons } from './header/RightButtons'
import { HeaderTitle } from './header/Title'

const arrowLeftIcon = require('../../assets/arrow-left-white.png')

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
        headerLeft            : () => <View style={{ padding: 6 }}/>,
        headerTitle           : HeaderTitle,
        headerRight           : props => <RightButtons {...props} tint={ButtonsTint.DARK}/>,
      }}>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name='Reward' component={RewardScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Workout'
                    component={WorkoutScreen}
                    options={({ route }) => ({
                      headerTitle      : (props: StackHeaderTitleProps) => <HeaderTitle
                        title={route.params['title']} {...props}/>,
                      headerTransparent: true,
                      headerRight           : props => <RightButtons {...props} tint={ButtonsTint.LIGHT}/>
                    })}
      />
      <Stack.Screen name='Training' component={TrainingScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}