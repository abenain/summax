import { Radio, Text } from '@ui-kitten/components'
import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { SummaxColors } from '../../../colors'

interface Props {
  icons: {
    false: JSX.Element
    true: JSX.Element
  }
  onChange: (value: boolean) => void
  text: string
  value: boolean
}

export function ChoiceTag({ icons: { false: uncheckedIcon, true: checkedIcon }, onChange, text, value }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={.8}
      onPress={() => onChange(!value)}
      style={[styles.choiceTag, value ? { backgroundColor: SummaxColors.lightishGreen } : {}]}>

      {value ? checkedIcon : uncheckedIcon}

      <Text style={[styles.text, value ? { color: 'white' } : {}]}>{text}</Text>

      <Radio checked={value} onChange={onChange} status={value ? 'warning' : 'basic'}/>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  choiceTag: {
    alignItems       : 'center',
    alignSelf        : 'stretch',
    backgroundColor  : SummaxColors.lightGrey,
    flexDirection    : 'row',
    height           : 48,
    paddingHorizontal: 15,
    paddingVertical  : 14,
  },
  text     : {
    color     : SummaxColors.blueGrey,
    flex      : 1,
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
  },
})