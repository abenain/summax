import { Layout, Text } from '@ui-kitten/components'
import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import i18n from 'i18n-js'

const premiumBannerBackground = require('./premium-banner.png')

interface Props {
  onBannerPress: () => void
  onCloseBanner: () => void
}

export function PremiumBanner({onBannerPress, onCloseBanner}: Props){
  return (
    <TouchableOpacity style={styles.premiumBannerContainer} activeOpacity={.8} onPress={onBannerPress}>

      <Layout style={styles.premiumBannerBackgroundContainer}>
        <Image
          resizeMode={'cover'}
          source={premiumBannerBackground}
          style={styles.premiumBannerBackground}/>
      </Layout>

      <Text style={styles.premiumBannerText}>{i18n.t('Home - Premium banner')}</Text>

      <TouchableOpacity style={styles.premiumBannerCrossIcon} activeOpacity={.8} onPress={onCloseBanner}>
        <Text>X</Text>
      </TouchableOpacity>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  premiumBannerContainer          : {
    height           : 60,
    justifyContent   : 'center',
    paddingHorizontal: 16,
    width            : '100%',
  },
  premiumBannerBackgroundContainer: {
    left    : 16,
    position: 'absolute',
    right   : 16,
    top     : 0,
  },
  premiumBannerBackground         : {
    height: 60,
    width : '100%'
  },
  premiumBannerText               : {
    fontFamily: 'nexaXBold',
    fontSize  : 14,
    marginLeft: 16,
  },
  premiumBannerCrossIcon          : {
    position: 'absolute',
    top     : 8,
    right   : 24,
  },
})