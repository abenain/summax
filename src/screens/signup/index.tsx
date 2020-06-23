import { Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useRef } from 'react'
import { ImageBackground, StatusBar, StyleSheet } from 'react-native'
import { SummaxColors } from '../../colors'
import { ButtonStyle, SummaxButton } from '../../components/summax-button/SummaxButton'
import { Form as SignUpForm, FormHandle } from './form'
import { useNavigation } from '@react-navigation/native'

const backgroundImage = require('../../../assets/login_background.png')

export function SignUpScreen() {
  const signUpForm = useRef<FormHandle>()
  const navigation = useNavigation()

  function doSignUp(){
    console.log(signUpForm.current.getValues())
    navigation.navigate('SignUpOtp')
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>

      <StatusBar barStyle={'light-content'}/>

      <SignUpForm ref={signUpForm}/>

      <Layout style={styles.buttonContainer}>
        <SummaxButton
          buttonStyle={ButtonStyle.GREEN}
          onPress={doSignUp}
          text={i18n.t('Sign up')}
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