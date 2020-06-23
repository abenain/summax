import { Button, Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { NoOp } from '../../utils'

interface Props {
  editable?: boolean
  onEditButtonPress?: () => void
  style?: ViewStyle
  title: string
  value?: string
}

export function Field({ editable = false, onEditButtonPress = NoOp, style = {}, title, value }: Props) {
  return (
    <Layout style={[styles.container, { height: editable ? 40 : 24 }, style]}>
      <Text style={styles.title}>{title}</Text>
      {editable ? (
        <Layout style={styles.editButtonContainer}>
          <Button
            appearance={'outline'}
            onPress={onEditButtonPress}
            status={'success'}
            style={styles.editButton}>Edit</Button>
        </Layout>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </Layout>
  )
}

const styles = StyleSheet.create({
  container          : {
    flexDirection: 'row',
    alignItems   : 'center'
  },
  title              : {
    fontFamily       : 'nexaXBold',
    fontSize         : 14,
    height           : 24,
    lineHeight       : 24,
    textAlignVertical: 'center',
  },
  value              : {
    flex      : 1,
    fontFamily: 'nexaRegular',
    fontSize  : 14,
    lineHeight: 20,
    textAlign : 'right',
  },
  editButtonContainer: {
    alignItems: 'flex-end',
    flex      : 1,
  },
  editButton         : {
    backgroundColor: 'white',
  },

})