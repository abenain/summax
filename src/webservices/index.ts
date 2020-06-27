import { Maybe } from 'tsmonad'
import { ActionType } from '../redux/actions'
import { getStore } from '../redux/store'
import { WebserviceError } from '../types'
import { fetchTokensFromRefreshToken } from './auth'

function refreshTokenAndRetry(webservice: (params: Object) => Promise<Maybe<any>>, config?: Object) {
  const store = getStore()
  const { userData: { refreshToken } } = store.getState()
  return Promise.resolve()
    .then(() => {
      const token = refreshToken.valueOrThrow({ error: new Error('no refresh token available') } as any)

      return fetchTokensFromRefreshToken(token)
    }).then(fetchTokenResult => {
      const {access, refresh} = fetchTokenResult.valueOrThrow(new Error('couldnt get new token from refresh token'))

      store.dispatch({
        access,
        refresh,
        type   : ActionType.GOT_TOKENS,
      })

      return webservice({
        ...config,
        token: access
      })
    }).catch((error: Error) => {
      console.log(error)
      getStore().dispatch({ type: ActionType.LOGOUT })
      return Maybe.nothing()
    })
}

export function callAuthenticatedWebservice(webservice: (params: Object) => Promise<Maybe<any>>, config = {}, freshToken?: string) {
  const store = getStore()
  const { userData: { accessToken } } = store.getState()
  const token = freshToken ? Maybe.just(freshToken) : accessToken

  return token.caseOf({
    just   : token => {
      return webservice({
        ...config,
        token
      }).catch((error: WebserviceError) => {
        console.log(error)

        if (error.status === 401) {
          return refreshTokenAndRetry(webservice, config)
        }

        return Maybe.nothing()
      })
    },
    nothing: () => Promise.resolve(Maybe.nothing())
  })
}