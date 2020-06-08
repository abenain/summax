import * as eva from '@eva-design/eva'
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import React from 'react'
import { StyleSheet } from 'react-native'
import en from '../assets/i18n/en'
import fr from '../assets/i18n/fr'

i18n.fallbacks = true
i18n.translations = { fr, en }
i18n.locale = Localization.locale

const HomeScreen = () => (
  <Layout style={styles.container}>
    <Text category='h1'>{i18n.t('Home')}</Text>
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
