import OTPInputView from '@twotalltotems/react-native-otp-input'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { SummaxColors } from '../colors'
import { NoOp } from '../utils'

const OTP_DIGIT_COUNT = 4
const summaxIcon = require('../../assets/summax.png')

interface Props {
  message: string
  onResendCodeRequest?: () => void
  onChange: (value: string) => void
  style?: ViewStyle
  value: string
}


export function OtpForm({ message, onResendCodeRequest = NoOp, onChange, style = {}, value }: Props) {
  return (
    <Layout style={[styles.container, style]}>

      <Image source={summaxIcon} style={styles.title}/>

      <Text style={styles.message}>{message}</Text>

      <OTPInputView
        style={styles.otpView}
        pinCount={OTP_DIGIT_COUNT}
        code={value}
        onCodeChanged={onChange}
        autoFocusOnLoad={false}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
      />

      <TouchableOpacity activeOpacity={.8} onPress={onResendCodeRequest}>
        <Text style={styles.resendCode}>{i18n.t('Sign up otp - Resend code')}</Text>
      </TouchableOpacity>

    </Layout>
  )
}

const styles = StyleSheet.create({
  container                : {
    backgroundColor  : '#ffffff',
    borderRadius     : 5,
    paddingHorizontal: 16,
    paddingVertical  : 32,
  },
  title                    : {
    alignSelf   : 'center',
    height      : 20,
    marginBottom: 103,
    width       : 103,
  },
  message                  : {
    fontFamily  : 'nexaRegular',
    fontSize    : 14,
    lineHeight  : 20,
    marginBottom: 33,
    textAlign   : 'center',
  },
  otpView                  : {
    alignSelf: 'stretch',
    height   : 70
  },
  underlineStyleBase       : {
    backgroundColor: 'rgb(247,249,252)',
    borderRadius   : 5,
    borderWidth    : 0,
    color          : SummaxColors.blueGrey,
    fontSize       : 14,
    height         : 48,
    width          : 71,
  },
  underlineStyleHighLighted: {
    borderColor: SummaxColors.lightishGreen,
    borderWidth: 1,
  },
  resendCode               : {
    alignSelf         : 'center',
    color             : SummaxColors.dark,
    fontFamily        : 'nexaXBold',
    fontSize          : 14,
    lineHeight        : 20,
    marginTop         : 33,
    textDecorationLine: 'underline',
  },
})