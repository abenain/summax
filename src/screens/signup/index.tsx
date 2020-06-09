import { Button } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useRef } from 'react'
import { ImageBackground, StatusBar, StyleSheet } from 'react-native'
import { SummaxColors } from '../../colors'
import { Form as SignUpForm, FormHandle } from './form'

const backgroundImage = require('../../../assets/login_background.png')

export function SignUp() {
  const signUpForm = useRef<FormHandle>()

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>

      <StatusBar barStyle={'light-content'}/>

      <SignUpForm ref={signUpForm}/>

      <Button
        status='success'
        style={[styles.button, styles.button]}
        appearance='filled'
        onPress={() => console.log(signUpForm.current.getValues())}
        size='giant'>
        {i18n.t('Sign up')}
      </Button>

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
    alignSelf: 'stretch',
    margin: 0,
    height: 56,
    backgroundColor: SummaxColors.lightishGreen,
    marginTop: 32,
  },
})