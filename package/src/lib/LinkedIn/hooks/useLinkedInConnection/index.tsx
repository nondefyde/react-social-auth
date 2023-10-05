import { useCallback, useEffect, useRef, useState } from 'react';
import { RS_LINKEDIN_OAUTH2_STATE, RS_PASS_CORS_KEY } from '../../constants';
import { window } from "../../../window";

export interface useLinkedInConnectionProps {
    redirectUri: string;
    clientId: string;
    clientSecret: string;
    onReject?: (reject: string | objectType) => void;
    onResolve?: ({ provider, data }: IResolveParams) => void;
    state?: string;
    scope?: Array<string>;
    closePopupMessage?: string;
    isOnlyGetCode?: boolean;
    isOnlyGetToken?: boolean;
}

export interface useLinkedInConnectionReturnType {
    onLinkedInConnect: () => void,
    isLoading: boolean,
    linkedInData: Record<string, any> |  null,
}

export interface objectType {
    [key: string]: any;
};
export interface IResolveParams {
    provider: string;
    data?: objectType;
};

const getPopupPositionProperties = ({ width = 600, height = 600 }) => {
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;
    return `left=${left},top=${top},width=${width},height=${height}`;
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

const PREVENT_CORS_URL: string = 'https://cors.bridged.cc';

const useLinkedInConnection = ({
    redirectUri,
    clientId,
    clientSecret,
    onResolve,
    onReject,
    scope = ["openid", "profile", "email", ],
    state = '',
    closePopupMessage = 'User closed the popup',
    isOnlyGetCode = false,
    isOnlyGetToken = false,
}: useLinkedInConnectionProps): useLinkedInConnectionReturnType => {
    const popupRef = useRef<Window | null>(null);
    const popUpIntervalRef = useRef<number | null>(null);
    const [linkedInData, setLinkedInData] = useState<Record<string, any> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getProfile = useCallback(
        (data: objectType) => {
            const url = `${PREVENT_CORS_URL}/https://api.linkedin.com/v2/me`;
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
                    onResolve?.({ provider: 'linkedin', data: { ...res.data } });
                    setLinkedInData({ provider: 'linkedin', data: { ...res.data } })
                    setIsLoading(false)
                })
                .catch(err => {
                    onReject?.(err)
                    setIsLoading(false)
                });
        },
        [  onReject, onResolve, setLinkedInData],
    );

    const getAccessToken = useCallback(
        async (code: string) => {
            if (isOnlyGetCode) {
                onResolve?.({ provider: 'linkedIn', data: { code } });
                setLinkedInData({ provider: 'linkedIn', data: { code } })
            }
            else {
                const payload: Record<string, any> = {
                    code,
                    redirect_uri: redirectUri,
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

                const requestAccessTokenOAuthURL = `${PREVENT_CORS_URL}/https://www.linkedin.com/oauth/v2/accessToken`;
                setIsLoading(true)
                const data = await fetch(requestAccessTokenOAuthURL, {
                    method: 'POST',
                    body: details.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'x-cors-grida-api-key': RS_PASS_CORS_KEY,

                    },
                })
                    .then(data => data.json())
                    .catch(err => {
                        onReject?.(err)
                        setIsLoading(false)
                    });
                if (data.access_token) {
                    if (isOnlyGetToken) {
                        onResolve?.({ provider: 'linkedin', data });
                        setLinkedInData({ provider: 'linkedin', data })
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
            redirectUri,
            isOnlyGetCode,
            isOnlyGetToken,
        ],
    );

    const receiveMessage = useCallback(
        async (event: MessageEvent) => {
            const savedState = localStorage.getItem(RS_LINKEDIN_OAUTH2_STATE);
            if (event.origin === window.location.origin) {
                if (event.data.errorMessage && event.data.from === 'LinkedIn') {
                    // Prevent CSRF attack by testing state
                    if (event.data.state !== savedState) {
                        popupRef.current && popupRef.current.close();
                        return;
                    }
                    onReject?.(event.data);
                    popupRef.current && popupRef.current.close();
                } else if (event.data.code && event.data.from === 'LinkedIn') {
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
        [onReject, onResolve],
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
        const scopeParam = `&scope=${encodeURI(scope.join(' '))}`;
        const generatedState = state || generateRandomString();
        localStorage.setItem(RS_LINKEDIN_OAUTH2_STATE, generatedState);
        const linkedInAuthLink = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}${scopeParam}&state=${generatedState}`;
        return linkedInAuthLink;
    };

    const onLogin = useCallback(async () => {
        setIsLoading(true)
        popupRef.current?.close();
        popupRef.current = window.open(
            getUrl(),
            '_blank',
            getPopupPositionProperties({ width: 600, height: 600 }),
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
    }, [ scope,
        state,
        clientId,
        redirectUri,
    ]);

    return {
        linkedInData,
        isLoading,
        onLinkedInConnect: onLogin,
    };
}

export default useLinkedInConnection