import { useEffect, useState } from 'react';
import './App.css';
import Greet from '../../package/src/lib/Greet';
import { useFacebookConnection } from '../../package/src/lib/Facebook';
import useTwitterConnection from '../../package/src/lib/Twitter'
import useSnapchatConnection from '../../package/src/lib/Snapchat';
import useLinkedInConnection from '../../package/src/lib/LinkedIn';
import useGoogleConnection from '../../package/src/lib/Google/'

type ParamsType = {
    state: string;
    code?: string;
    error?: string;
    error_description?: string;
};

function App() {
    const REDIRECT_URI = `${typeof window === 'object' && window.location.origin}/twitter`
    const REDIRECT_URI2 = 'https://5e93-102-89-34-102.ngrok-free.app'

    const { onFacebookConnect, facebookData } = useFacebookConnection({})
    const { onTwitterConnect, twitterData, isLoading } = useTwitterConnection({ clientId: process.env.RS_TWITTER_CLIENT_KEY as string, redirect_uri: REDIRECT_URI, isOnlyGetCode: false, isOnlyGetToken: false, clientKeys: `${process.env.RS_TWITTER_CLIENT_KEYS as string}` });
    const { onSnapChatConnect, snapchatData, isLoading: isSnapchatLoading } = useSnapchatConnection({ clientId: process.env.RS_SNAPCHAT_CLIENT_KEY as string, clientSecret: process.env.RS_SNAPCHAT_BUSINESS_CLIENT_SECRET_KEY as string, redirect_uri: REDIRECT_URI2, isOnlyGetCode: true, isOnlyGetToken: false });
    const { onLinkedInConnect, linkedInData, isLoading: isLinkedInLoading } = useLinkedInConnection({
        clientId: process.env.RS_LINKEDIN_CLIENT_KEY as string,
        clientSecret: process.env.RS_LINKEDIN_CLIENT_SECRET as string,
        redirectUri: `${window.location.origin}`,
        isOnlyGetToken: true
    })
    const { onGoogleConnect, isLoading: isGoogleLoading } = useGoogleConnection({
        onSuccess: (tokenResponse: any) => {
            console.log("google token response", tokenResponse)
        }, redirectUri: window.location.origin
    })
    const [errorMessage, setErrorMessage] = useState<string>('');

    // console.log("twitterData:::", twitterData)
    // console.log("snapchatData:::", snapchatData)
    // console.log("linkedInData:::", linkedInData)

    const parse = (search: string) => {
        const query = search.substring(1);
        const vars = query.split('&');
        const parsed: Record<string, any> = {};
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (pair.length > 1) {
                parsed[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }
        return parsed;
    }

    useEffect(() => {
        const params = parse(window.location.search) as ParamsType;
        if (params.state !== localStorage.getItem('twitter_oauth2_state')) {
            setErrorMessage('State does not match');

        } else if (params.error) {
            const errorMessage =
                params.error_description || 'Login failed. Please try again.';
            const bc = new BroadcastChannel("twitter-channel")
            bc.postMessage({
                error: params.error,
                state: params.state,
                errorMessage,
                from: 'Twitter',
            })
            window.close();
            // Close tab if user cancelled login
            if (params.error === 'user_cancelled_login') {
                window.close();
            }
        }
        if (params.code) {
            const bc = new BroadcastChannel("twitter-channel")
            bc.postMessage({ code: params.code, state: params.state, from: 'Twitter' })
            window.close();

        }
    }, []);

    // useEffect(() => {
    //     const params = parse(window.location.search) as ParamsType;

    //     if (params.state !== localStorage.getItem(`${process.env.RS_SNAPCHAT_OAUTH2_STATE}`)) {
    //         setErrorMessage('State does not match');

    //     } else if (params.error) {
    //         const errorMessage =
    //             params.error_description || 'Login failed. Please try again.';

    //         window.opener &&
    //             window.opener.postMessage(
    //                 {
    //                     error: params.error,
    //                     state: params.state,
    //                     errorMessage,
    //                     from: 'Snapchat',
    //                 },
    //                 window.location.origin,
    //             );
    //         window.close();

    //         // Close tab if user cancelled login
    //         if (params.error === 'user_cancelled_login') {
    //             window.close();
    //         }
    //     }
    //     if (params.code) {
    //         window.opener &&
    //             window.opener.postMessage(
    //                 { code: params.code, state: params.state, from: 'Snapchat' },
    //                 window.location.origin,
    //             );
    //         window.close();
    //     }
    // }, []);

    // useEffect(() => {
    //     const params = parse(window.location.search) as ParamsType;
    //     if (params.state !== localStorage.getItem(`${process.env.RS_LINKEDIN_OAUTH2_STATE}`)) {
    //       setErrorMessage('State does not match');
    //     } else if (params.error) {
    //       const errorMessage =
    //         params.error_description || 'Login failed. Please try again.';
    //       window.opener &&
    //         window.opener.postMessage(
    //           {
    //             error: params.error,
    //             state: params.state,
    //             errorMessage,
    //             from: 'LinkedIn',
    //           },
    //           window.location.origin,
    //         );
    //       // Close tab if user cancelled login
    //       if (params.error === 'user_cancelled_login') {
    //         window.close();
    //       }
    //     }
    //     if (params.code) {
    //       window.opener &&
    //         window.opener.postMessage(
    //           { code: params.code, state: params.state, from: 'LinkedIn' },
    //           window.location.origin,
    //         );
    //         window.close();
    //     }
    //   }, []);
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
