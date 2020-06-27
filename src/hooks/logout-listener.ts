import { useEffect } from 'react'
import { getStore } from '../redux/store'

export default function useLogoutListener(logoutListener: () => void) {
  const store = getStore()
  const accessToken = store.getState().userData.accessToken

  useEffect(() => {
    const shouldNavigateToLoginScreen = accessToken.caseOf({
      just   : () => false,
      nothing: () => true
    })

    if (shouldNavigateToLoginScreen) {
      logoutListener()
    }
  }, [accessToken.valueOr(false)])

}