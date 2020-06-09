import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { Image, StyleSheet } from 'react-native'
import { Target } from '../../../types'
import { Filter } from './filter'

const target = require('./target.png')
const upperBody = require('./upper_body.png')
const lowerBody = require('./lower_body.png')
const core = require('./core.png')
const wholeBody = require('./whole_body.png')

interface Props {
  onFilter?: (target: Target) => void
}

export function TargetFilters({onFilter = () => {}}: Props) {
  return (
    <Layout style={styles.container}>

      <Image source={target} style={styles.target}/>

      <Text category='h3' style={styles.title}>{i18n.t('Home - Target')}</Text>

      <Layout style={[styles.filterRow, { marginBottom: 16 }]}>
        <Filter
          image={upperBody}
          onPress={() => onFilter(Target.UPPER_BODY)}
          style={styles.leftFilter}
          title={i18n.t('Filter - Target - Upper body')}/>
        <Filter
          image={lowerBody}
          onPress={() => onFilter(Target.LOWER_BODY)}
          style={styles.rightFilter}
          title={i18n.t('Filter - Target - Lower body')}/>
      </Layout>

      <Layout style={[styles.filterRow]}>
        <Filter
          image={core}
          onPress={() => onFilter(Target.CORE)}
          style={styles.leftFilter}
          title={i18n.t('Filter - Target - Core')}/>
        <Filter
          image={wholeBody}
          onPress={() => onFilter(Target.WHOLE_BODY)}
          style={styles.rightFilter}
          title={i18n.t('Filter - Target - Whole body')}/>
      </Layout>

    </Layout>
  )
}

const styles = StyleSheet.create({
  container  : {
    paddingTop       : 72,
    paddingBottom    : 40,
    paddingHorizontal: 16,
    overflow         : 'hidden',
  },
  target     : {
    position: 'absolute',
    height  : 148,
    width   : 147,
    top     : -35,
    right   : 0,
  },
  title      : {
    color       : 'black',
    marginBottom: 32,
  },
  filterRow  : {
    flexDirection: 'row',
  },
  leftFilter : {
    flex       : 1,
    marginRight: 8,
  },
  rightFilter: {
    flex      : 1,
    marginLeft: 8,
  },
})