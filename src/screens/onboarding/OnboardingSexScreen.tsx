import { useNavigation } from '@react-navigation/native'
import { Text } from '@ui-kitten/components'
import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { BaseScreen } from './BaseScreen'

export function OnboardingSexScreen() {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BaseScreen onContinue={() => navigation.navigate('OnboardingTarget')}>
        <Text category={'h1'}>Oboarding 1</Text>
      </BaseScreen>
    </SafeAreaView>
  )
}