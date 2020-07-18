import { Input, Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import HideWithKeyboard from 'react-native-hide-with-keyboard'
import { NoOp } from '../../utils'

const summax = require('./summax.png')

interface Props {
  emailValue?: string
  onEmailChanged?: (email: string) => void
}

export function Form({ emailValue = '', onEmailChanged = NoOp }: Props) {
  return (
    <Layout style={styles.container}>

      <Image source={summax} style={styles.title}/>

      <Text style={styles.smallText}>{i18n.t('Forgot password - Instructions')}</Text>

      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Email')}
        value={emailValue}
        onChangeText={onEmailChanged}
        textStyle={styles.inputText}
      />

      <HideWithKeyboard>
        <Layout style={{ height: 72 }}/>
      </HideWithKeyboard>

    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor  : '#ffffff',
    borderRadius     : 5,
    paddingHorizontal: 16,
    paddingVertical  : 32,
  },
  title    : {
    alignSelf   : 'center',
    marginBottom: 32,
    width       : 103,
    height      : 20,
  },
  input    : {
    marginBottom: 22
  },
  inputText: {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
  },
  smallText: {
    fontFamily  : 'nexaRegular',
    fontSize    : 14,
    lineHeight  : 20,
    marginBottom: 32,
  },
})