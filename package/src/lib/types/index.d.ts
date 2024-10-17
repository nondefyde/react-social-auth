export declare interface UseTwitterConnectionReturnType {
    onTwitterConnect: () => void,
    isLoading: boolean,
    twitterData: Record<string, any>,
}

export declare interface UseTwitterConnectionProps {
    clientId: string;
    base64EncodeBasicAuthHeader: string
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

export declare interface objectType {
    [key: string]: any;
};
export declare interface IResolveParams {
    provider: string;
    data?: objectType;
};

export declare interface useSnapChatConnectionReturnType {
    snapchatData: Record<string, any> | null;
    isLoading: boolean;
    onSnapChatConnect: () => void;
}

export declare interface useSnapChatConnectionProps {
    clientId: string;
    clientSecret: string;
    redirect_uri: string;
    scope?: Array<string>;
    onReject?: (reject: string | objectType) => void;
    onResolve?: ({ provider, data }: IResolveParams) => void;
    onLoginStart?: () => void;
    closePopupMessage?: string;
    state?: string;
    isOnlyGetCode?: boolean;
    isOnlyGetToken?: boolean;
}


export declare interface useLinkedInConnectionProps {
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
export declare interface useLinkedInConnectionReturnType {
    onLinkedInConnect: () => void,
    isLoading: boolean,
    linkedInData: Record<string, any> |  null,
}
export declare interface useGoogleConnectionType {
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

export declare interface useGoogleConnectionProps {
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

export declare interface useGoogleConnectionReturnType {
    onGoogleConnect: () => void,
    isLoading: boolean,
}