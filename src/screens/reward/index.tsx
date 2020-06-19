import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { RootStackParamList } from '../../App'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'

export function RewardScreen() {
  const navigation: StackNavigationProp<RootStackParamList, 'Reward'> = useNavigation()
  return (
    <Layout style={{ flex: 1 }}>

      <SafeAreaView style={{flex: 1}}>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text category={'h1'}>Bravo!</Text>
        </Layout>

        <Layout style={{ paddingHorizontal: 16, height: 56 }}>
          <SummaxButton buttonStyle={ButtonStyle.WHITE} text={'backabcak'} onPress={navigation.popToTop}/>
        </Layout>
      </SafeAreaView>


    </Layout>
  )
}