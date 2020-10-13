import { Text } from '@ui-kitten/components'
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

export function IntensityChoiceTag({ icons: { false: unselectedIcon, true: selectedIcon }, onChange, text, value }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={.8}
      onPress={() => onChange(!value)}
      style={styles.choiceTag}>

      {value ? selectedIcon : unselectedIcon}

      <Text style={styles.text}>{text}</Text>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  choiceTag: {
    alignItems: 'center',
  },
  text     : {
    color     : SummaxColors.midnight,
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 20,
    marginTop : 11,
  },
})