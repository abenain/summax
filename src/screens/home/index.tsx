import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import i18n from 'i18n-js'
import { StyleSheet } from 'react-native'

export function Home() {
  return (
    <Layout style={{ flex: 1 }}>

      <Layout style={styles.titleContainer}>
        <Text category='h2'>{i18n.t('Home - Featured workout')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h2'>{i18n.t('Home - Selected for you', { firstname: 'Yannick' })}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h2'>{i18n.t('Home - Featured themes')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h2'>{i18n.t('Home - Popular workouts')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h2'>{i18n.t('Home - Target')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h2'>{i18n.t('Home - Intensity')}</Text>
      </Layout>

      <Layout style={styles.titleContainer}>
        <Text category='h2'>{i18n.t('Home - Duration')}</Text>
      </Layout>

    </Layout>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    padding: 16
  },
})