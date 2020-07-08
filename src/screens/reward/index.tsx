import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Layout, Text } from '@ui-kitten/components'
import Constants from 'expo-constants'
import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StatusBar, StyleSheet } from 'react-native'
import { RootStackParamList } from '../../App'
import { SummaxColors } from '../../colors'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'

const summax = require('./summax.png')
const boltCirle = require('./bolt-circle.png')

export function RewardScreen() {
  const navigation: StackNavigationProp<RootStackParamList, 'Reward'> = useNavigation()

  return (
    <LinearGradient style={styles.gradientBackground}
                    colors={[SummaxColors.fadedYellow, 'rgb(142,233, 116)', SummaxColors.lightishGreen]}
                    start={[1, 0]}
                    end={[0, 1]}
                    locations={[0, .35, 1]}>

      <StatusBar barStyle={'light-content'} translucent={true}/>

      <Layout style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Layout style={styles.summaxContainer}>
          <Image source={summax} style={styles.summaxIcon}/>
        </Layout>

        <Layout style={styles.contents}>
          <Image source={boltCirle} style={styles.boltIcon}/>
          <Text style={styles.bigText}>{i18n.t('Reward - Kudos').toUpperCase()}</Text>
          <Text style={styles.smallText}>{i18n.t('Reward - Nice workout').toUpperCase()}</Text>
        </Layout>

        <Layout style={styles.buttonContainer}>
          <SummaxButton buttonStyle={ButtonStyle.WHITE} text={i18n.t('Reward - Back home')}
                        onPress={navigation.popToTop}/>
        </Layout>
      </Layout>


    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex : 1,
    width: '100%',
  },
  summaxContainer   : {
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: 'transparent',
    height         : 50,
    marginTop      : Constants.statusBarHeight,
  },
  summaxIcon        : {
    height: 20,
    width : 103,
  },
  contents          : {
    alignItems       : 'center',
    backgroundColor  : 'transparent',
    flex             : 1,
    flexWrap         : 'nowrap',
    justifyContent   : 'center',
    paddingHorizontal: 36,
  },
  boltIcon          : {
    height      : 130,
    marginBottom: 43,
    width       : 103,
  },
  bigText           : {
    color     : 'white',
    fontFamily: 'aktivGroteskXBold',
    fontSize  : 59,
  },
  smallText         : {
    color      : 'white',
    fontFamily : 'aktivGroteskXBold',
    fontSize   : 38,
    textAlign  : 'center',
  },
  buttonContainer   : {
    backgroundColor  : 'transparent',
    height           : 56,
    marginBottom     : 32,
    paddingHorizontal: 16,
  }
})