import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { ImageBackground, StatusBar, StyleSheet } from 'react-native'
import { SummaxColors } from '../../colors'
import { OtpForm } from '../../components/OtpForm'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'

const backgroundImage = require('../../../assets/login_background.png')

export function SignUpOtpScreen() {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>

      <StatusBar barStyle={'light-content'}/>

      <Layout style={styles.formContainer}>
        <OtpForm message={i18n.t('Sign up otp - Message')} style={{flex: 1}}/>
      </Layout>

      <Layout style={styles.buttonContainer}>
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          onPress={() => console.log('check otp')}
          text={i18n.t('Sign up otp - Button')}
        />
      </Layout>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background     : {
    flex             : 1,
    justifyContent   : 'flex-end',
    alignItems       : 'stretch',
    paddingHorizontal: 16,
    paddingBottom    : 36,
  },
  formContainer  : {
    flex      : 1,
    marginTop: 200,
  },
  buttonContainer: {
    paddingTop     : 36,
    flexDirection  : 'row',
    backgroundColor: 'transparent'
  },
  button         : {
    alignSelf      : 'stretch',
    margin         : 0,
    height         : 56,
    backgroundColor: SummaxColors.lightishGreen,
    marginTop      : 32,
  },
})