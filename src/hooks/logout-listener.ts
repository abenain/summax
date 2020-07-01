import { useRef } from 'react'
import { getStore } from '../redux/store'

export default function useLogoutListener(logoutListener: () => void) {
  const store = getStore()
  const accessToken = useRef(store.getState().userData.accessToken)

  store.subscribe(function stateChanged(){
    const newAccessToken = store.getState().userData.accessToken

    const shouldNavigateToLoginScreen = newAccessToken.caseOf({
      just   : () => false,
      nothing: () => accessToken.current.caseOf({
        just: () => true,
        nothing: () => false
      })
    })

    accessToken.current = newAccessToken

    if (shouldNavigateToLoginScreen) {
      logoutListener()
    }
  })
}