import { Datepicker, Icon, Input, Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'

const MIN_DOB = moment().subtract(120, 'years').toDate()
const MAX_DOB = moment().subtract(10, 'years').toDate()

const summax = require('./summax.png')

interface Props {
  confirmPasswordValue?: string
  dobValue?: Date
  emailValue?: string
  firstnameValue?: string
  lastnameValue?: string
  onConfirmPasswordChanged?: (value: string) => void
  onDobChanged?: (value: Date) => void
  onEmailChanged?: (value: string) => void
  onFirstnameChanged?: (value: string) => void
  onLastnameChanged?: (value: string) => void
  onPasswordChanged?: (value: string) => void
  passwordValue?: string
}

export function Form({ confirmPasswordValue, dobValue, emailValue, firstnameValue, lastnameValue, onConfirmPasswordChanged, onDobChanged, onEmailChanged, onFirstnameChanged, onLastnameChanged, onPasswordChanged, passwordValue }: Props) {
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
        placeholder={i18n.t('Placeholder - Firstname')}
        value={firstnameValue}
        onChangeText={onFirstnameChanged}
        textStyle={styles.inputText}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Lastname')}
        value={lastnameValue}
        onChangeText={onLastnameChanged}
        textStyle={styles.inputText}
      />
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Email')}
        value={emailValue}
        onChangeText={onEmailChanged}
        textStyle={styles.inputText}
      />
      <Datepicker
        date={dobValue}
        max={MAX_DOB}
        min={MIN_DOB}
        placeholder={props => {
          const { style, ...restOfProps } = props
          return <Text {...restOfProps} style={[style, styles.inputText]}>{i18n.t('Placeholder - DOB')}</Text>
        }}
        style={{ ...styles.input, ...styles.inputText }}
        onSelect={onDobChanged}
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
      <Input
        style={styles.input}
        placeholder={i18n.t('Placeholder - Password confirm')}
        value={confirmPasswordValue}
        secureTextEntry={true}
        onChangeText={onConfirmPasswordChanged}
        textStyle={styles.inputText}
      />

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
    marginBottom: 64,
    width       : 103,
    height      : 20,
  },
  input    : {
    marginBottom: 22
  },
  inputText: {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    fontWeight: 'bold',
  },
})