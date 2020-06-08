import { Button, Layout } from '@ui-kitten/components'
import i18n from 'i18n-js'
import { useRef } from 'react'
import * as React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { SummaxColors } from '../../colors'
import { Form as LoginForm, FormHandle } from './form'

const backgroundImage = require('./login_background.png')

export function Login() {
  const loginForm = useRef<FormHandle>()

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>

      <LoginForm ref={loginForm}/>

      <Layout style={styles.buttonContainer}>
        <Button
          status='control'
          style={[styles.button, styles.signUpButton]}
          appearance='outline' size='giant'>
          {i18n.t('Sign up')}
        </Button>
        <Button
          status='success'
          style={[styles.button, styles.signInButton]}
          appearance='filled'
          onPress={() => console.log(loginForm.current.getValues())}
          size='giant'>
          {i18n.t('Sign in')}
        </Button>
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
    flex  : 1,
    margin: 0,
    height: 56,
  },
  signUpButton   : {
    marginRight: 11,
    borderWidth: 2,
    borderColor: SummaxColors.lightishGreen
  },
  signInButton   : {
    backgroundColor: SummaxColors.lightishGreen
  },
})