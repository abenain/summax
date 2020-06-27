import { createTransform } from 'redux-persist'
import { Maybe } from 'tsmonad'

export function createMonadTransform(keyWhitelist: string[]) {
  return createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState: Maybe<any>) => {
      // convert monad to value
      return inboundState.valueOr(null)
    },
    // transform state being rehydrated
    (outboundState: any) => {
      // convert value to a monad
      return Maybe.maybe(outboundState)
    },
    // define which reducers this transform gets called for.
    { whitelist: keyWhitelist }
  )
}