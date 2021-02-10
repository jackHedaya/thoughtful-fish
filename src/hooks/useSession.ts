import { useContext } from 'react'

import { SessionContext } from '../pages/_app'

export default function useSession() {
  return useContext(SessionContext)
}
