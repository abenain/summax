import { useNavigation } from '@react-navigation/native'
import { Layout, Text } from '@ui-kitten/components'
import i18n from 'i18n-js'
import * as React from 'react'
import { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

const premiumBannerBackground = require('./premium-banner.png')

interface Props {
  canHideBanner?: boolean
  isPremium: boolean
}

export function PremiumBanner({ canHideBanner = true, isPremium }: Props) {
  const [hideBanner, setHideBanner] = useState(false)
  const navigation = useNavigation()

  if (isPremium || hideBanner) {
    return null
  }

  return (
    <TouchableOpacity style={styles.premiumBannerContainer} activeOpacity={.8}
                      onPress={() => navigation.navigate('Subscription')}>

      <Layout style={styles.premiumBannerBackgroundContainer}>
        <Image
          resizeMode={'cover'}
          source={premiumBannerBackground}
          style={styles.premiumBannerBackground}/>
      </Layout>

      <Text style={styles.premiumBannerText}>{i18n.t('Home - Premium banner')}</Text>

      {
        canHideBanner && (
          <TouchableOpacity style={styles.premiumBannerCrossIcon} activeOpacity={.8}
                            onPress={() => setHideBanner(true)}>
            <Text>X</Text>
          </TouchableOpacity>
        )
      }

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