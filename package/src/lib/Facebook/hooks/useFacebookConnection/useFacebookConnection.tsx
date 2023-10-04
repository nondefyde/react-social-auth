import { useState } from 'react'
import useFacebook from '../useFacebook/useFacebook'

export interface UseFacebookConnectionReturnType {
  onFacebookConnect: () => void
  isLoading: boolean
  facebookData: Record<string, any>
  fb: any
}

export interface UseFacebookConnectionProps {
  scope?: string[]
  response_type?: string
  return_scopes?: boolean
}

export type FaceBookLoginOption = {
  config_id?: string
  response_type?: string
  scope: string
  return_scopes: boolean
  enable_profile_selector?: boolean
}

const defaultPermissions: string[] = [
  'email',
  'public_profile'
]

const useFacebookConnection = (props: UseFacebookConnectionProps): UseFacebookConnectionReturnType => {
  const { scope = [...defaultPermissions], response_type, return_scopes = true } = props
  const { isLoading, init } = useFacebook();

  const userFacebookOption = {
    scope: scope.join(','),
    response_type,
    return_scopes,
  }
  
  const [options, setOption] = useState<FaceBookLoginOption>(userFacebookOption)
  const [facebookData, setFacebookData] = useState<Record<string, any>>({})
  const [fb, setFB] = useState<any>({})

  const onFacebookConnect = async () => {
    try {
      const api: any = await init()
      const FB = await api.getFB()
      setFB(FB);
      FB.login(
        (response: any) => {
          setFacebookData(response.authResponse)
        },
        { ...options },
      )
    } catch (error: any) {
      // Todo send error to init UI.
      console.log('facebook error here >>>> ', error)
    }
  }

  return {
    fb,
    isLoading,
    facebookData,
    onFacebookConnect,
  }
}

export default useFacebookConnection
