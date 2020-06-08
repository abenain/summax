import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { StyleSheet } from 'react-native'

export function Home() {
  return (
    <Layout style={styles.container}>
      <Text category='h1'>{i18n.t('Home')}</Text>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex          : 1,
    justifyContent: 'center',
    alignItems    : 'center'
  },
})