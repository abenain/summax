import * as eva from '@eva-design/eva'
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet } from 'react-native'

const HomeScreen = () => (
  <Layout style={styles.container}>
    <Text category='h1'>HOME</Text>
  </Layout>
)

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <HomeScreen/>
  </ApplicationProvider>
)

const styles = StyleSheet.create({
  container: {
    flex          : 1,
    justifyContent: 'center',
    alignItems    : 'center'
  },
})
