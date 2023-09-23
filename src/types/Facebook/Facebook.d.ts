import React from 'react'
import type { FacebookOptions } from '../Facebook/utils'

export type UseFacebookConnectProps = {
  isBusiness?: boolean
}

export type FacebookProviderProps = FacebookOptions & {
  children: ReactNode
}

declare const useFacebookConnect: React.FC<UseFacebookConnectProps>
declare const FacebookProvider: React.FC<FacebookProviderProps>

export default { useFacebookConnect, FacebookProvider }
