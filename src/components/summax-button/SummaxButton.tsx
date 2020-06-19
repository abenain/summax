import { Text } from '@ui-kitten/components'
import * as React from 'react'
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { SummaxColors } from '../../colors'
import { NoOp } from '../../utils'

export enum ButtonStyle {
  BLACK,
  GREEN,
  WHITE,
}

interface Props {
  buttonStyle?: ButtonStyle
  children?: React.ReactNode
  onPress?: () => void
  style?: ViewStyle
  text?: string
}

function getStylesForButton(buttonStyle: ButtonStyle) {
  switch (buttonStyle) {
    case ButtonStyle.BLACK:
      return [styles.baseButton, styles.blackButton]
    case ButtonStyle.GREEN:
      return [styles.baseButton, styles.greenButton]
    case ButtonStyle.WHITE:
      return [styles.baseButton, styles.whiteButton]
    default:
      return []
  }
}

function getStylesForText(buttonStyle: ButtonStyle) {
  switch (buttonStyle) {
    case ButtonStyle.BLACK:
      return [styles.text, styles.blackButtonText]
    case ButtonStyle.GREEN:
      return [styles.text, styles.greenButtonText]
    case ButtonStyle.WHITE:
      return [styles.text, styles.whiteButtonText]
    default:
      return []
  }
}

function getPropsForButton(buttonStyle: ButtonStyle) {
  switch (buttonStyle) {
    case ButtonStyle.BLACK:
      return {
        status    : 'control',
        appearance: 'outline'
      }
    case ButtonStyle.GREEN:
      return {
        status    : 'success',
        appearance: 'filled'
      }
    case ButtonStyle.WHITE:
      return {
        status    : 'success',
        appearance: 'filled'
      }
    default:
      return {}
  }
}

export function SummaxButton({ buttonStyle = ButtonStyle.BLACK, children, onPress = NoOp, style = {}, text }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={.9}
      style={[...getStylesForButton(buttonStyle), style]}
      onPress={onPress}
      {...getPropsForButton(buttonStyle)}>
      {children ? children : (
        <Text style={getStylesForText(buttonStyle)}>{text}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  baseButton     : {
    alignItems    : 'center',
    borderRadius  : 5,
    flex          : 1,
    justifyContent: 'center',
    margin        : 0,
    height        : 56,
  },
  blackButton    : {
    backgroundColor: 'black',
    borderWidth    : 2,
    borderColor    : SummaxColors.lightishGreen,
    marginRight    : 11,
  },
  greenButton    : {
    backgroundColor: SummaxColors.lightishGreen
  },
  whiteButton    : {
    backgroundColor: 'white',
    borderWidth    : 2,
    borderColor    : SummaxColors.lightishGreen,
  },
  text           : {
    color     : 'white',
    fontSize  : 18,
    lineHeight: 24,
  },
  blackButtonText: {
    fontFamily: 'nexaHeavy',
  },
  whiteButtonText: {
    color     : 'black',
    fontFamily: 'nexaXBold',
  },
  greenButtonText: {
    fontFamily: 'nexaHeavy',
  },
})