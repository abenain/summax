import qs from 'qs'
import { Linking } from 'react-native'

export const CONTACT_US_EMAIL = 'contact@summax.fr'
export const CONTACT_US_PHONE_NUMBER = '0686501605'
export const TERMS_OF_USE_URL = 'https://summax.fr/cgu'
export const PRIVACY_URL = 'https://summax.fr/politique_confidentialite'
export const LIABILITY_URL = 'https://summax.fr/declinaison_responsabilite'
export function NoOp() {
}

export const PosterAspectRatio = {
  workoutBackground: 600 / 375,
  homepageFeatured : 487 / 343,
  workoutCard      : 160 / 275,
}

interface EmailOptions {
  bcc?: string
  body?: string
  cc?: string
  subject?: string
}

export async function sendEmail(to: string, options: EmailOptions = {}) {
  const { cc, body, bcc, subject } = options

  const query = `?${qs.stringify({
    bcc,
    body,
    cc,
    subject,
  })}`

  const url = `mailto:${to}${query}`

  return openUrl(url)
}

export function makePhoneCall(number: string) {
  const url = `tel:${number}`

  return openUrl(url)
}

export async function openUrl(url: string){
  if (!await Linking.canOpenURL(url)) {
    throw new Error('Provided URL can not be handled')
  }

  return Linking.openURL(url)
}