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
        onSuccess,
        onError,
        onNonOAuthError,
        overrideScope= false,
        state,
        redirectUri
    } = props;

    const {clientId, scriptLoadedSuccessfully} = useGoogleOAuth();
    const clientRef = useRef<any>();

    const onSuccessRef = useRef(onSuccess);
    onSuccessRef.current = onSuccess;

    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const onNonOAuthErrorRef = useRef(onNonOAuthError);
    onNonOAuthErrorRef.current = onNonOAuthError;

    useEffect(() => {

    }, [scriptLoadedSuccessfully])

    useEffect(() => {
        if (!scriptLoadedSuccessfully) return;

        clientRef.current = window?.google?.accounts.oauth2['initCodeClient']({
            client_id: clientId,
            response_type: 'code',
            access_type: 'offline',
            redirect_uri: redirectUri,
            scope: overrideScope ? scope : `openid profile email ${scope}`,
            callback: (response: any) => {
                console.log('response ::: ', response);
                if (response.error) return onErrorRef.current?.(response);

                onSuccessRef.current?.(response as any);
            },
            error_callback: (nonOAuthError: NonOAuthError) => {
                onNonOAuthErrorRef.current?.(nonOAuthError);
            },
            state,
            ...props,
        });
    }, [clientId, scriptLoadedSuccessfully, flow, scope, state]);

    const loginAuthCodeFlow = useCallback(
        () => clientRef.current?.requestCode(),
        [],
    );

    return {
        onGoogleConnect: loginAuthCodeFlow,
        isLoading: !scriptLoadedSuccessfully,
    };
}
