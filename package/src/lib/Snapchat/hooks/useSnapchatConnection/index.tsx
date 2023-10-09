import { useCallback, useEffect, useRef, useState } from 'react';
import { RS_SNAPCHAT_OAUTH2_STATE } from '../../constants';

export interface useSnapChatConnectionReturnType {
    snapchatData: Record<string, any> | null;
    isLoading: boolean;
    onSnapChatConnect: () => void;
}

export interface useSnapChatConnectionProps {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope?: Array<string>;
    onReject?: (reject: string | objectType) => void;
    onResolve?: ({ provider, data }: IResolveParams) => void;
    onLoginStart?: () => void;
    closePopupMessage?: string;
    state?: string;
    isOnlyGetCode?: boolean;
    isOnlyGetToken?: boolean;
}

export interface objectType {
    [key: string]: any;
};
export interface IResolveParams {
    provider: string;
    data?: objectType;
};

const generateRandomString = (length = 20) => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const useSnapChatConnection = (props: useSnapChatConnectionProps): useSnapChatConnectionReturnType => {
    const { clientId, clientSecret, redirectUri, scope =['snapchat-marketing-api', 'snapchat-profile-api']
    , closePopupMessage = 'User closed the popup', onReject, onResolve, onLoginStart, state, isOnlyGetCode = false,
        isOnlyGetToken = false, } = props
    const [snapchatData, setSnapchatData] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    const popupRef = useRef<Window | null>(null);
    const popUpIntervalRef = useRef<number | null>(null);

    const getAccessToken = useCallback(
        async (code: string) => {
            if (isOnlyGetCode) {
                onResolve?.({ provider: 'snapchat', data: { code } });
                setSnapchatData({ provider: 'snapchat', data: { code } })
            }
            else {

                const payload: Record<string, any> = {
                    code,
                    redirect_uri:redirectUri,
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: `authorization_code`,
                }
                const details = new URLSearchParams();

                for (const key in payload) {
                    if (payload.hasOwnProperty(key)) {
                        details.append(key, payload[key]);
                    }
                }


                const requestAccessTokenOAuthURL = `https://accounts.snapchat.com/login/oauth2/access_token`;
                setIsLoading(true)
                const data = await fetch(requestAccessTokenOAuthURL, {
                    method: 'POST',
                    body: details.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                    .then(data => data.json())
                    .catch(err => {
                        onReject?.(err)
                        setIsLoading(false)
                    });
                if (data?.access_token) {
                    if (isOnlyGetToken) {
                        onResolve?.({ provider: 'snapchat', data });
                        setSnapchatData({ provider: 'snapchat', data })
                        setIsLoading(false)
                    }
                }
            }
        },
        [
            onReject,
            onResolve,
            clientId,
            redirectUri,
            isOnlyGetCode,
            isOnlyGetToken,
        ],
    );


    const onChangeLocalStorage = useCallback(() => {
        window.removeEventListener('storage', onChangeLocalStorage, false);
        const code = localStorage.getItem('snapchat');
        if (code) {
            localStorage.removeItem('snapchat');
        }
    }, []);

    const receiveMessage = useCallback(
        async (event: MessageEvent) => {
            const savedState = localStorage.getItem(RS_SNAPCHAT_OAUTH2_STATE);
            localStorage.setItem('snapchat', `${event.data.code}`);

            if (event.origin === window.location.origin) {
                if (event.data.errorMessage && event.data.from === 'Snapchat') {
                    // Prevent CSRF attack by testing state
                    if (event.data.state !== savedState) {
                        setIsLoading(false)
                        popupRef.current && popupRef.current.close();
                        return;
                    }
                    onReject?.(event.data);
                    popupRef.current && popupRef.current.close();
                    setIsLoading(false)

                } else if (event.data.code && event.data.from === 'Snapchat') {
                    // Prevent CSRF attack by testing state
                    if (event.data.state !== savedState) {
                        console.error('State does not match');
                        setIsLoading(false)
                        popupRef.current && popupRef.current.close();
                        return;
                    }
                    await getAccessToken(event.data.code)
                    popupRef.current && popupRef.current.close();
                }
            }
        },
        [],
    );

    useEffect(() => {
        return () => {
            window.removeEventListener('message', receiveMessage, false);

            if (popupRef.current) {
                popupRef.current.close();
                popupRef.current = null;
            }
            if (popUpIntervalRef.current) {
                window.clearInterval(popUpIntervalRef.current);
                popUpIntervalRef.current = null;
            }
        };
    }, [receiveMessage]);

    useEffect(() => {
        window.addEventListener('message', receiveMessage, false);
        return () => {
            window.removeEventListener('message', receiveMessage, false);
        };
    }, [receiveMessage]);

    const getUrl = () => {
        const generatedState = state || generateRandomString();
        localStorage.setItem(RS_SNAPCHAT_OAUTH2_STATE, generatedState);
        const scope = ['snapchat-marketing-api', 'snapchat-profile-api']
        const scopes = scope.join(" ")
        const oauthUrl = `https://accounts.snapchat.com/login/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${generatedState}`
        return oauthUrl;
    };

    const onLogin = useCallback(async () => {
        onLoginStart?.();
        window.addEventListener('storage', onChangeLocalStorage, false);

        popupRef.current?.close();
        popupRef.current = window.open(
            getUrl(),
            '_blank'
        );
        if (popUpIntervalRef.current) {
            window.clearInterval(popUpIntervalRef.current);
            popUpIntervalRef.current = null;
        }
        popUpIntervalRef.current = window.setInterval(() => {
            try {
                if (popupRef.current && popupRef.current.closed) {
                    window.clearInterval(popUpIntervalRef.current as any);
                    popUpIntervalRef.current = null;
                    if (onReject) {
                        onReject({
                            error: 'user_closed_popup',
                            errorMessage: closePopupMessage,
                        });
                    }
                }
            } catch (error) {
                console.error(error);
                window.clearInterval(popUpIntervalRef.current as any);
                popUpIntervalRef.current = null;
            }
        }, 1000);
    }, [
        scope,
        clientId,
        redirectUri,
        state,
        onChangeLocalStorage,
        onLoginStart,
    ])

    return { snapchatData, isLoading, onSnapChatConnect: onLogin };
}

export default useSnapChatConnection;
