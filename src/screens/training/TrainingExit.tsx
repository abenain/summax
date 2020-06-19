import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, SafeAreaView, StyleSheet } from 'react-native'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { NoOp } from '../../utils'

const summaxIcon = require('../../../assets/summax.png')
const hangingImage = require('./hanging.png')

interface Props {
  onResume?: () => void
  onQuit?: () => void
}

export function TrainingExit({ onResume = NoOp, onQuit = NoOp }: Props) {
  return (
    <SafeAreaView style={styles.backgroundContainer}>

      <Layout style={styles.titleContainer}>
        <Image source={summaxIcon} style={styles.summaxIcon}/>
      </Layout>

      <Layout style={styles.contents}>

        <Layout style={styles.imageContainer}>
          <Image source={hangingImage} style={styles.image}/>
        </Layout>

        <Layout style={styles.textContainer}>
          <Text style={styles.text}>{i18n.t('Training Exit - Are you sure')}</Text>
        </Layout>
      </Layout>

      <Layout style={styles.buttonContainer}>
        <SummaxButton
          buttonStyle={ButtonStyle.WHITE_GREEN_TEXT}
          onPress={onQuit}
          style={{ marginBottom: 19 }}
          text={i18n.t('Training Exit - Quit')}/>
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          onPress={onResume}
          text={i18n.t('Training Exit - Resume')}/>
      </Layout>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: 'white',
    flex           : 1,
  },
  titleContainer     : {
    alignItems: 'center',
    height    : 20,
    marginTop : 15,
  },
  summaxIcon         : {
    height: 20,
    width : 103,
  },
  contents           : {
    alignItems       : 'center',
    flex             : 1,
    paddingHorizontal: 16,
  },
  imageContainer     : {
    alignItems    : 'center',
    flex          : 1,
    justifyContent: 'center',
  },
  image              : {
    height: 203,
    width : 210,
  },
  textContainer      : {
    height           : 48,
    paddingHorizontal: 32,
  },
  text               : {
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 24,
    textAlign : 'center',
  },
  buttonContainer    : {
    height           : 131,
    paddingHorizontal: 16,
    marginVertical   : 32,
  },
})


