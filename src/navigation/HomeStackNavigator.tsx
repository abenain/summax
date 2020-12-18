import { createStackNavigator } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as React from 'react'
import { Image, Platform, View } from 'react-native'
import { FilterScreen } from '../screens/filter'
import { HomeScreen } from '../screens/home'
import { RewardScreen } from '../screens/reward'
import { TrainingScreen } from '../screens/training'
import { WorkoutScreen } from '../screens/workout'
import { ButtonsTint, RightButtons } from './header/RightButtons'
import { HeaderTitle } from './header/Title'

const arrowLeftIcon = require('../../assets/arrow-left-black.png')
const arrowLeftIconWhite = require('../../assets/arrow-left-white.png')

export function HomeStackNavigator() {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerBackImage       : () => <Image source={arrowLeftIconWhite}
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
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => <View style={{ padding: 6 }}/>, }}/>
      <Stack.Screen name="Filter" component={FilterScreen} options={{headerBackImage       : () => <Image source={arrowLeftIcon}
                                                                                                          style={{ height: 24, marginLeft: 16, width: 24 }}/>,}}/>
      <Stack.Screen name='Reward' component={RewardScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Workout'
                    component={WorkoutScreen}
                    options={() => ({
                      headerTitle      : () => null,
                      headerTransparent: true,
                      headerRight      : props => <RightButtons {...props} tint={ButtonsTint.LIGHT}/>
                    })}
      />
      <Stack.Screen name='Training' component={TrainingScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}