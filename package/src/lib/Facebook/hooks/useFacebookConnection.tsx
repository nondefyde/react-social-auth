import { useEffect, useState } from 'react'
import useFacebook from './useFacebook'

interface UseFacebookConnectionReturnType {
  onFacebookConnect: () => void
  isLoading: boolean
  facebookData: Record<string, any>
}

interface UseFacebookConnectionProps {
  isBusiness?: boolean;
  scope?: string[]
}

type FaceBookLoginOption = {
  config_id?: string
  response_type?: string
  scope: string
  return_scopes: boolean
  enable_profile_selector?: boolean
}

const userPermissions: string[] = [
  'email',
  'public_profile',
  'user_events',
  'user_photos',
  'user_videos',
  'user_posts',
  'user_likes',
  'pages_manage_posts',
  'pages_manage_engagement',
  'pages_show_list',
  'publish_to_groups',
  'ads_management',
  'ads_read',
  'read_insights',
]

const businessPermissions: string[] = [
  'email',
  'business_management',
  'ads_management',
  'ads_read',
  'read_insights',
  'pages_manage_posts',
  'pages_read_engagement',
  'pages_read_user_content',
  'pages_show_list',
]

const businessFacebookOption = {
  // config_id: '866760837642711',
  // response_type: 'code',
  scope: businessPermissions.join(','),
  return_scopes: true,
  // enable_profile_selector: true
}


const useFacebookConnection = (props: UseFacebookConnectionProps): UseFacebookConnectionReturnType => {
  const { isBusiness = false, scope = [...userPermissions] } = props
  const { isLoading, init } = useFacebook();

  const userFacebookOption = {
    scope: scope.join(','),
    return_scopes: true,
  }
  
  const [options, setOption] = useState<FaceBookLoginOption>(userFacebookOption)
  const [facebookData, setFacebookData] = useState<Record<string, any>>({})

  useEffect(() => {
    setOption(isBusiness ? businessFacebookOption : userFacebookOption)
  }, [isBusiness])

  const onFacebookConnect = async () => {
    try {
      const api: any = await init()
      const FB = await api.getFB()
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
    isLoading,
    facebookData,
    onFacebookConnect,
  }
}

export default useFacebookConnection
