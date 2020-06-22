import { createStackNavigator, StackHeaderTitleProps } from '@react-navigation/stack'
import * as React from 'react'
import { HeaderTitle } from '../components/header-title'
import { LoginScreen } from '../screens/login'
import { RewardScreen } from '../screens/reward'
import { SignUpScreen } from '../screens/signup'
import { TrainingScreen } from '../screens/training'
import { WorkoutScreen } from '../screens/workout'
import { BottomTabNavigator } from './BottomTabNavigator'

export function MainStackNavigator() {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown       : false
      }}>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='Home' component={BottomTabNavigator}/>
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