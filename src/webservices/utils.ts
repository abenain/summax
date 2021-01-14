import Constants from 'expo-constants'
import { Exercise } from '../types'

const SCHEME_HTTP = 'http'
const SCHEME_HTTPS = 'https'
const BACKEND_URL_DEV = '10.0.0.6:18000'
//const BACKEND_URL_DEV = '192.168.10.124:18000'
const BACKEND_URL_PROD = 'api.summax.fr'

export enum ApiVersion {
  V1 = 'v1',
  V2 = 'v2'
}

const CLIENT_ID = 'ayhcwZdiy5rgWreq3wN6tA2hk2HC'

export function getBackendUrl() {
  const { releaseChannel } = Constants.manifest

  if (Boolean(releaseChannel) === false) {
    return `${SCHEME_HTTP}://${BACKEND_URL_DEV}`
  }

  if (releaseChannel.indexOf('prod') !== -1) {
    return `${SCHEME_HTTP}://${BACKEND_URL_PROD}`
  }

  if (releaseChannel.indexOf('staging') !== -1) {
    return `${SCHEME_HTTP}://${BACKEND_URL_PROD}`
  }

  return `${SCHEME_HTTP}://${BACKEND_URL_DEV}`
}

export function getApiBaseUrl(apiVersion = ApiVersion.V1) {
  return `${getBackendUrl()}/${apiVersion}`
}

export function checkFetchResponseIsOKOrThrow(response: Response) {
  if (response.status !== 200 && response.status !== 201) {
    throw {
      status: response.status,
    }
  }

  return Promise.resolve()
}

export function getClientIdHeader() {
  return {
    'client-id': CLIENT_ID
  }
}

export function getJsonPayloadHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}

export function getAuthorizationHeaders(token: string) {
  return {
    'Authorization': `Bearer ${token}`
  }
}

const BASE_JWPLAYER_URL = 'content.jwplatform.com'
const JWPLAYER_THUMBS_FOLDER = 'thumbs'
const JWPLAYER_VIDEO_FOLDER = 'videos'
const JWPLAYER_THUMB_WIDTH = '150'
const JWPLAYER_1080P_CODEC_ID_PROD = 'XbWGWCTK'

export function getExerciseVideoUrl(exercise: Exercise){
  return `${SCHEME_HTTPS}://${BASE_JWPLAYER_URL}/${JWPLAYER_VIDEO_FOLDER}/${exercise.mediaId}-${JWPLAYER_1080P_CODEC_ID_PROD}.mp4`
}

export function getExerciseThumbnail(exercise: Exercise){
  return `${SCHEME_HTTPS}://${BASE_JWPLAYER_URL}/${JWPLAYER_THUMBS_FOLDER}/${exercise.mediaId}-${JWPLAYER_THUMB_WIDTH}.jpg`
}