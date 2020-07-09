import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { SummaxColors } from '../../colors'
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
          <TouchableOpacity
            onPress={onEditButtonPress}
            style={styles.editButton}>
            <Text style={styles.editButtonText}>{i18n.t('Edit')}</Text>
          </TouchableOpacity>
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
    backgroundColor  : 'white',
    borderColor      : SummaxColors.lightishGreen,
    borderRadius     : 4,
    borderWidth      : 1,
    paddingVertical  : 8,
    paddingHorizontal: 24,
  },
  editButtonText     : {
    color     : SummaxColors.lightishGreen,
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    lineHeight: 24
  },
})