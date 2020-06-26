import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import i18n from 'i18n-js'

export function MyWorkoutsScreen() {
  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

      <Layout style={[styles.mainPadding, {marginBottom: 33, marginTop: 30,}]}>
        <Text style={styles.title}>{i18n.t('My Workouts - Resume')}</Text>
      </Layout>

      <Layout>

      </Layout>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainPadding: {
    paddingHorizontal: 16,
  },
  title      : {
    color     : 'black',
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 30,
    lineHeight: 27,
  },
})