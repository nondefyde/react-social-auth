import { useEffect, useState } from 'react';

export type ParamsType = {
  state: string;
  code?: string;
  error?: string;
  error_description?: string;
};

export function TwitterCallback() {
  const [errorMessage, setErrorMessage] = useState<string>('');

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
        if (params.state !== localStorage.getItem(process.env.RS_TWITTER_OAUTH2_STATE as string)) {
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

  return <div>{errorMessage}</div>;
}