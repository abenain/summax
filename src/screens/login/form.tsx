import { Icon, Input, Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useState } from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { NoOp } from '../../utils'

const summax = require('./summax.png')

interface Props {
  emailValue?: string
  onEmailChanged?: (email: string) => void
  onForgotPassword?: (email?: string) => void
  onPasswordChanged?: (password: string) => void
  onSignUpPressed?: () => void
  passwordValue?: string
}

export function Form({ emailValue = '', onEmailChanged = NoOp, onForgotPassword, onPasswordChanged = NoOp, onSignUpPressed = NoOp, passwordValue = '' }: Props) {
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const renderShowPasswordIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}/>
    </TouchableWithoutFeedback>
  )

  return (
    <Layout style={styles.container}>

      <Image source={summax} style={styles.title}/>

      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Email')}
        value={emailValue}
        onChangeText={onEmailChanged}
        textStyle={styles.inputText}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Password')}
        value={passwordValue}
        accessoryRight={renderShowPasswordIcon}
        secureTextEntry={secureTextEntry}
        onChangeText={onPasswordChanged}
        textStyle={styles.inputText}
      />

      <Text onPress={() => onForgotPassword(emailValue)} style={[styles.hyperlinkText, { marginBottom: 32 }]}>{i18n.t('Sign in - Forgot password')}</Text>

      <HideWithKeyboard>
        <Layout style={{ height: 100 }}/>
      </HideWithKeyboard>

      <Layout style={{ flexDirection: 'row' }}>
        <Text style={[styles.smallText, { marginRight: 8 }]}>{i18n.t('Sign in - No account yet')}</Text>
        <Text style={styles.hyperlinkText} onPress={onSignUpPressed}>{i18n.t('Sign in - Go to sign up')}</Text>
      </Layout>

    </Layout>
  )
}

const styles = StyleSheet.create({
  container    : {
    backgroundColor  : '#ffffff',
    borderRadius     : 5,
    paddingHorizontal: 16,
    paddingVertical  : 32,
  },
  title        : {
    alignSelf   : 'center',
    marginBottom: 32,
    width       : 103,
    height      : 20,
  },
  input        : {
    marginBottom: 22
  },
  inputText    : {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
  },
  hyperlinkText: {
    fontFamily        : 'nexaXBold',
    fontSize          : 14,
    lineHeight        : 20,
    textDecorationLine: 'underline'
  },
  smallText    : {
    fontFamily: 'nexaRegular',
    fontSize  : 14,
    lineHeight: 20,
  },
})