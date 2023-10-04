import { useCallback, useEffect, useRef, useState } from "react";
import { RS_PASS_CORS_KEY, RS_TWITTER_OAUTH2_STATE } from "../../constants";
import { window } from "../../../window";

export interface UseTwitterConnectionReturnType {
    onTwitterConnect: () => void,
    isLoading: boolean,
    twitterData: Record<string, any>,
}

export interface UseTwitterConnectionProps {
    clientId: string;
    clientKeys: string
    redirect_uri: string;
    state?: string;
    fields?: string;
    scope?: string;
    isOnlyGetCode?: boolean;
    isOnlyGetToken?: boolean;
    onLoginStart?: () => void;
    onReject?: (reject: string | objectType) => void;
    onResolve?: ({ provider, data }: IResolveParams) => void;
    closePopupMessage?: string;
}

export interface objectType {
    [key: string]: any;
};
export interface IResolveParams {
    provider: string;
    data?: objectType;
};

const TWITTER_URL: string = 'https://twitter.com';
const TWITTER_API_URL: string = 'https://api.twitter.com';
const PREVENT_CORS_URL: string = 'https://cors.bridged.cc';

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

const useTwitterConnection = (props: UseTwitterConnectionProps): UseTwitterConnectionReturnType => {
    const { clientId,
        clientKeys,
        redirect_uri,
        fields = 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld',
        state,
        scope = 'users.read%20tweet.read%20offline.access%20tweet.write',
        isOnlyGetCode = false,
        isOnlyGetToken = false,
        onLoginStart,
        onReject,
        onResolve,
        closePopupMessage = 'User closed the popup',
    } = props;
    const [twitterData, setTwitterData] = useState<Record<string, any>>({})
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const popupRef = useRef<Window | null>(null);
    const popUpIntervalRef = useRef<number | null>(null);

    const getProfile = useCallback(
        (data: objectType) => {
            const url = `${PREVENT_CORS_URL}/${TWITTER_API_URL}/2/users/me?user.fields=${fields}`;
            setIsLoading(true)
            fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                    'x-cors-grida-api-key': RS_PASS_CORS_KEY,
                },
            })
                .then(res => res.json())
                .then(res => {
                    onResolve?.({ provider: 'twitter', data: { ...res.data } });
                    setTwitterData({ provider: 'twitter', data: { ...res.data } })
                    setIsLoading(false)
                })
                .catch(err => {
                    onReject?.(err)
                    setIsLoading(false)
                });
        },
        [fields, onReject, onResolve, setTwitterData],
    );

    const getAccessToken = useCallback(
        async (code: string) => {
            if (isOnlyGetCode) {
                onResolve?.({ provider: 'twitter', data: { code } });
                setTwitterData({ provider: 'twitter', data: { code } })
            }
            else {
                const payload: Record<string, any> = {
                    code,
                    redirect_uri,
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code_verifier: 'challenge',
                }
                const details = new URLSearchParams();

                for (const key in payload) {
                    if (payload.hasOwnProperty(key)) {
                        details.append(key, payload[key]);
                    }
                }

                const requestOAuthURL = `${PREVENT_CORS_URL}/${TWITTER_API_URL}/2/oauth2/token`;
                const base64Encoding = btoa(clientKeys)
                setIsLoading(true)
                const data = await fetch(requestOAuthURL, {
                    method: 'POST',
                    body: details.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'x-cors-grida-api-key': RS_PASS_CORS_KEY,
                        'Authorization': `Basic ${base64Encoding}`
                    },
                })
                    .then(data => data.json())
                    .catch(err => {
                        onReject?.(err)
                        setIsLoading(false)
                    });

                if (data.access_token) {
                    if (isOnlyGetToken) {
                        onResolve?.({ provider: 'twitter', data });
                        setTwitterData({ provider: 'twitter', data })
                        setIsLoading(false)
                    }
                    else getProfile(data);
                }
            }
        },
        [
            onReject,
            onResolve,
            clientId,
            redirect_uri,
            isOnlyGetCode,
            isOnlyGetToken,
        ],
    );

    const onChangeLocalStorage = useCallback(() => {
        window.removeEventListener('storage', onChangeLocalStorage, false);
        const code = localStorage.getItem('twitter');
        if (code) {
            localStorage.removeItem('twitter');
        }
    }, []);

    const receiveMessage = useCallback(
        async (event: MessageEvent) => {
            const savedState = localStorage.getItem(RS_TWITTER_OAUTH2_STATE);
            localStorage.setItem('twitter', `${event.data.code}`);

            if (event.origin === window.location.origin) {
                if (event.data.errorMessage && event.data.from === 'Twitter') {
                    // Prevent CSRF attack by testing state
                    if (event.data.state !== savedState) {
                        popupRef.current && popupRef.current.close();
                        return;
                    }
                    onReject?.(event.data);
                    popupRef.current && popupRef.current.close();

                } else if (event.data.code && event.data.from === 'Twitter') {
                    // Prevent CSRF attack by testing state
                    if (event.data.state !== savedState) {
                        console.error('State does not match');
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
            const bc = new BroadcastChannel("twitter-channel")
            bc.removeEventListener('message', receiveMessage, false);

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
        const bc = new BroadcastChannel("twitter-channel")
        bc.addEventListener('message', receiveMessage, false);
        return () => {
            bc.removeEventListener('message', receiveMessage, false);
        };
    }, [receiveMessage]);

    const getUrl = () => {
        const generatedState = state || generateRandomString();
        localStorage.setItem(RS_TWITTER_OAUTH2_STATE, generatedState);
        const oauthUrl = `${TWITTER_URL}/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&scope=${scope}&state=${generatedState}&code_challenge=challenge&code_challenge_method=plain`;
        return oauthUrl;
    };

    const onLogin = useCallback(async () => {
        onLoginStart?.();
        window.addEventListener('storage', onChangeLocalStorage, false);
        const width = 450;
        const height = 730;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        popupRef.current?.close();
        popupRef.current = window.open(
            getUrl(),
            '_blank',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
            width +
            ', height=' +
            height +
            ', top=' +
            top +
            ', left=' +
            left,
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
        state,
        clientId,
        onLoginStart,
        redirect_uri,
        onChangeLocalStorage,
    ]);

    return {
        twitterData,
        isLoading,
        onTwitterConnect: onLogin,
    };
};
export default useTwitterConnection