/* eslint-disable import/export */
import {useCallback, useEffect, useRef} from 'react';

import {
    NonOAuthError,
} from '../../types';
import { useGoogleOAuth } from '../../components/GoogleOAuthProvider/GoogleOAuthProvider';

export interface objectType {
    [key: string]: any;
};
export interface IResolveParams {
    provider: string;
    data?: objectType;
};

export interface useGoogleConnectionProps {
    redirectUri: string;
    responseType?: 'code' | 'token',
    onError?: (response:any) => void;
    onSuccess: (response:any) => void;
    state?: string;
    scope?: string;
    flow?: string;
    overrideScope?: boolean;
    onNonOAuthError?: (response:any) => void;
}

export interface useGoogleConnectionReturnType {
    onGoogleConnect: () => void,
    isLoading: boolean,
}

export default function useGoogleConnection(props: useGoogleConnectionProps): useGoogleConnectionReturnType {
    const {
        flow = 'implicit',
        scope = '',
        responseType = 'code',
        onSuccess,
        onError,
        onNonOAuthError,
        overrideScope = false,
        state,
        redirectUri
    } = props;

    const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
    const clientRef = useRef<any>(null);

    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    const onNonOAuthErrorRef = useRef(onNonOAuthError);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        onNonOAuthErrorRef.current = onNonOAuthError;
    }, [onNonOAuthError]);

    useEffect(() => {
        if (!scriptLoadedSuccessfully || !clientId) return;

        clientRef.current = window?.google?.accounts.oauth2[
            responseType === 'token' ? 'initTokenClient' : 'initCodeClient'
        ]({
            client_id: clientId,
            response_type: responseType,
            access_type: responseType !== 'token' ? undefined : 'offline',
            redirect_uri: redirectUri,
            scope: overrideScope ? scope : `openid profile email ${scope}`,
            callback: (response: any) => {
                if (response.error) {
                    onErrorRef.current?.(response);
                    return;
                }
                onSuccessRef.current?.(response);
            },
            error_callback: (nonOAuthError: NonOAuthError) => {
                onNonOAuthErrorRef.current?.(nonOAuthError);
            },
            state,
        });
    }, [clientId, scriptLoadedSuccessfully, flow, scope, state, responseType, redirectUri, overrideScope]);

    const loginAuthCodeFlow = useCallback(() => {
        if (clientRef.current) {
            if (responseType === 'token') {
                clientRef.current.requestAccessToken();
            } else {
                clientRef.current.requestCode();
            }
        }
    }, [responseType]);

    return {
        onGoogleConnect: loginAuthCodeFlow,
        isLoading: !scriptLoadedSuccessfully,
    };
}
