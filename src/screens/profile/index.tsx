import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { SafeAreaView } from 'react-native'

export function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text category={'h1'}>Profile</Text>
      </Layout>
    </SafeAreaView>
  )
}