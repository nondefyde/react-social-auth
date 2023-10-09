import { useEffect, useState } from 'react';
import './App.css';
import Greet from '../../package/src/lib/Greet';
import { useFacebookConnection } from '../../package/src/lib/Facebook';
import useTwitterConnection from '../../package/src/lib/Twitter'
import useSnapchatConnection from '../../package/src/lib/Snapchat';
import useLinkedInConnection from '../../package/src/lib/LinkedIn';
import useGoogleConnection from '../../package/src/lib/Google/'

function App() {
    const REDIRECT_URI = `${typeof window === 'object' && window.location.origin}/callback/twitter`
    const REDIRECT_URI2 = 'https://5e93-102-89-34-102.ngrok-free.app'

    const { onFacebookConnect } = useFacebookConnection({})
    const { onTwitterConnect, isLoading } = useTwitterConnection({ clientId: process.env.RS_TWITTER_CLIENT_KEY as string, redirectUri: REDIRECT_URI, isOnlyGetCode: false, isOnlyGetToken: false, clientKeys: `${process.env.RS_TWITTER_CLIENT_KEYS as string}` });
    const { onSnapChatConnect, isLoading: isSnapchatLoading } = useSnapchatConnection({ clientId: process.env.RS_SNAPCHAT_CLIENT_KEY as string, clientSecret: process.env.RS_SNAPCHAT_BUSINESS_CLIENT_SECRET_KEY as string, redirectUri: REDIRECT_URI2, isOnlyGetCode: true, isOnlyGetToken: false });
    const { onLinkedInConnect, linkedInData, isLoading: isLinkedInLoading } = useLinkedInConnection({
        clientId: process.env.RS_LINKEDIN_CLIENT_KEY as string,
        clientSecret: process.env.RS_LINKEDIN_CLIENT_SECRET as string,
        redirectUri: `${window.location.origin}/callback/linkedin`,
        isOnlyGetToken: true,
        scope: ["openid", "profile", "email"]
    })
    const { onGoogleConnect, isLoading: isGoogleLoading } = useGoogleConnection({
        onSuccess: (tokenResponse: any) => {
            console.log("google token response", tokenResponse)
        }, redirectUri: window.location.origin
    })

    // console.log("twitterData:::", twitterData)
    // console.log("snapchatData:::", snapchatData)
    console.log("linkedInData:::", linkedInData)

    return (
        <div className="App">
            <header className="App-header">
                <Greet message={'testing greeting here'}
                    description={'testing description here'} />
                <button onClick={onFacebookConnect}>Connect to Facebook</button>
                <button disabled={isLoading} onClick={onTwitterConnect}>Connect to Twitter</button>
                <button disabled={isSnapchatLoading} onClick={onSnapChatConnect}>Connect to Snapchat</button>
                <button disabled={isLinkedInLoading} onClick={onLinkedInConnect}>Connect to LinkedIn</button>
                <button disabled={isGoogleLoading} onClick={onGoogleConnect}>Connect to Google</button>
            </header>
        </div>
    );
}

export default App;
