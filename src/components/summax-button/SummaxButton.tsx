import { Button, Text } from '@ui-kitten/components'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { SummaxColors } from '../../colors'
import { NoOp } from '../../utils'

export enum ButtonStyle {
  BLACK,
  GREEN,
}

interface Props {
  buttonStyle?: ButtonStyle
  onPress?: () => void
  text: string
}

function getStylesForButton(buttonStyle: ButtonStyle) {
  switch (buttonStyle) {
    case ButtonStyle.BLACK:
      return [styles.baseButton, styles.blackButton]
    case ButtonStyle.GREEN:
      return [styles.baseButton, styles.greenButton]
    default:
      return {}
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
    default:
      return {}
  }
}

export function SummaxButton({ buttonStyle = ButtonStyle.BLACK, onPress = NoOp, text }: Props) {
  return (
    <Button
      style={getStylesForButton(buttonStyle)}
      onPress={onPress}
      size='giant'
      {...getPropsForButton(buttonStyle)}>
      {evaProps => <Text style={styles.text} {...evaProps}>{text}</Text>}
    </Button>
  )
}

const styles = StyleSheet.create({
  baseButton : {
    flex  : 1,
    margin: 0,
    height: 56,
  },
  blackButton: {
    marginRight: 11,
    borderWidth: 2,
    borderColor: SummaxColors.lightishGreen
  },
  greenButton: {
    backgroundColor: SummaxColors.lightishGreen
  },
  text       : {
    fontFamily: 'nexaXBold',
    fontSize  : 18,
    lineHeight: 24,
  },
})