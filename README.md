# React Social Login Using OAuth 2.0

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![npm package][npm-badge]][npm]
[![npm](https://img.shields.io/npm/dt/@ekaruz/react-social-auth)](https://www.npmjs.com/package/@ekaruz/react-social-auth)


This npm package provides support for multiple social logins within a React application. It is built using TypeScript and offers React Hooks for seamless integration. Notably, the package is designed to be highly efficient, with tree-shakeable code, zero external dependencies, and a lightweight footprint.

Using this package is straightforward. You simply need to call the appropriate hook for your preferred social media platform, providing the required props along with any additional props that align with your specific needs. This makes it easy to implement social login functionality tailored to your application's requirements.

##### In ReactJS, our package provides support for the following platforms:
- Facebook
- Google
- Twitter
- LinkedIn
- Snapchat

See [Usage](#usage) and [Demo](#demo) for guidelines.
## Table of contents

- [Installation](#installation)
- [Overview](#overview)
- [Usage](#usage)
- [Demo](#demo)
- [Props](#props)
- [Components](#components)
- [Contribution](#contribution)
- [Issues](#issues)


## Installation

```
npm install --save @ekaruz/react-social-auth
```

## Overview

Our hooks, such as `useTwitterConnection`, are activated by destructuring their respective onClick event handlers. When a user clicks the "Sign in with Twitter" button, a popup window will appear, requesting the user's permission. Once the user accepts, the popup window redirects to the user-specified redirectUri. At this point, you gain access to the data you need based on the provided props. You can use [react-router-dom](https://reactrouter.com/web) or [Next.js's file system routing](https://nextjs.org/docs/routing/introduction)

## Usage

First, we create a button and provide required props:

```js
import React, { useState } from 'react';

import { useTwitterConnection } from '@ekaruz/react-social-auth';

function TwitterPage() {
  const { onTwitterConnect, twitterData, isLoading } = useTwitterConnection({ clientId:'texcdfgr',  clientKeys:'gvbhgtyh', redirect_uri: REDIRECT_URI, isOnlyGetCode: true });


  return (
  <button disabled={isLoading} onClick={onTwitterConnect}>Sign in with Twitter</button>
  <div>{twitterData}</div>

  );
}
```
Important Note: Your client IDs and keys are considered private and confidential information. It is essential to store them as environment variables for security purposes.

It's worth noting that for Twitter integration, your `clientKeys` consist of a combination of your `Client ID` and `Client Secret` separated by a colon `:` from your developer account. For instance, it should be formatted as `clientId:clientSecret`.

Then we point `redirect_uri` to `TwitterCallback`. You can use [react-router-dom](https://reactrouter.com/web) or [Next.js's file system routing](https://nextjs.org/docs/routing/introduction)

- `react-router-dom`:

```js
import React from 'react';
import { TwitterCallback } from '@ekaruz/react-social-auth';
import { BrowserRouter, Route } from 'react-router-dom';

function Demo() {
  return (
    <BrowserRouter>
      <Route exact path="/twitter" component={TwitterCallback} />
    </BrowserRouter>
  );
}
```

- Next.js's file system routing:

```js
// twitter/page.tsx
import { TwitterCallback } from '@ekaruz/react-social-auth';
export default function TwitterPage() {
  return <TwitterCallback />;
}
```

Important Note: Callback pages are required only for Twitter, Snapchat, and LinkedIn integrations. For Google, you just have to provide a `redirectUri`. Additionally, it is crucial that your redirect URLs precisely match the values provided in the respective developer consoles for each platform.

## Demo

- In actual usage: []()

## Props
- `useFacebookConnection` hook:

| Parameter | value | is required | default value |
|-----------|-------|-------------|---------------|

- `useGoogleConnection` hook:

| Parameter       | value    | is required | default value |
|-----------------|----------|-------------|---------------|
| redirectUri     | string   | true        |               |
| state           | string   | false       | ''            |
| scope           | string   | false       |               |
| flow            | string   | false       | 'implicit'    |
| onSuccess       | function | true        |               |
| onError         | function | false       |               |
| overrideScope   | boolean  | false       | false         |
| onNonOAuthError | function | false       |               |

- `useTwitterConnection` hook:

| Parameter         | value    | is required | default value                                                                                                                                                                                  |
|-------------------|----------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| clientId          | string   | true        |                                                                                                                                                                                                |
| clientKeys        | string   | true        | consist of a combination of your `Client ID` and `Client Secret` separated by a colon `:` from your developer account. For instance, it should be formatted as `clientId:clientSecret`         |
| redirect_uri      | string   | true        |                                                                                                                                                                                                |
| state             | string   | false       | A randomly generated string (we recommend keeping the default value).                                                                                                                          |
| scope             | string   | false       | 'users.read%20tweet.read%20offline.access%20tweet.write' (A string containing scopes seperated by %20 (a single space))                                                                        |
| onResolve         | function | false       |                                                                                                                                                                                                |
| onReject          | function | false       |                                                                                                                                                                                                |
| closePopupMessage | string   | false       | 'User closed the popup'                                                                                                                                                                        |
| isOnlyGetCode     | boolean  | false       |                                                                                                                                                                                                |
| isOnlyGetToken    | boolean  | false       |                                                                                                                                                                                                |
| fields            | string   | false       | 'created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld' (A string containing fields seperated by a comma) |
| onLoginStart      | function | false       |                                                                                                                                                                                                |

- `useLinkedInConnection` hook:

| Parameter         | value            | is required | default value                                                         |
|-------------------|------------------|-------------|-----------------------------------------------------------------------|
| clientId          | string           | true        |                                                                       |
| clientSecret      | string           | true        |                                                                       |
| redirectUri       | string           | true        |                                                                       |
| state             | string           | false       | A randomly generated string (we recommend keeping the default value). |
| scope             | Array of string | false       | ["openid", "profile","email"]                                         |
| onResolve         | function         | false       |                                                                       |
| onReject          | function         | false       |                                                                       |
| closePopupMessage | string           | false       | User closed the popup                                                 |
| isOnlyGetCode     | boolean          | false       |                                                                       |
| isOnlyGetToken    | boolean          | false       |                                                                       |

- `useSnapchatConnection` hook:

| Parameter         | value           | is required | default value                                                                               |
|-------------------|-----------------|-------------|---------------------------------------------------------------------------------------------|
| clientId          | string          | true        |                                                                                             |
| clientSecret      | string          | true        |                                                                                             |
| redirect_uri      | string          | true        |                                                                                             |
| state             | string          | false       | A randomly generated string (we recommend keeping the default value).                       |
| scope             | Array of string | false       | ['snapchat-marketing-api','snapchat-profile-api'] (we recommend keeping the default value). |
| onResolve         | function        | false       |                                                                                             |
| onReject          | function        | false       |                                                                                             |
| closePopupMessage | string          | false       | 'User closed the popup'                                                                     |
| isOnlyGetCode     | boolean         | false       |                                                                                             |
| isOnlyGetToken    | boolean         | false       |                                                                                             |
| onLoginStart      | function        | false       |                                                                                             |

- Our `useSnapchatConnection` hook requires you create a Snapchat Business marketing account, then create an OAuth App under the business details section, thereafter you are given your `Client ID` and `Client Secret`. Do so [Here](https://bit.ly/45hOaWO)
## Components

- `FacebookProvider` component:

| Parameter | value  | is required |
|-----------|--------|-------------|
| appId     | string | true        |

- `GoogleOAuthProvider` component:

| Parameter | value  | is required |
|-----------|--------|-------------|
| clientId  | string | true        |

- The `useFacebookConnection` and `useGoogleConnection` hooks should be employed within their corresponding providers, namely `FacebookProvider` and `GoogleOAuthProvider`, respectively.

- TwitterCallback
- LinkedInCallback
- SnapChatCallback

- All Callback components have zero props

## Contribution

Clone project, open terminal and type these commands

```bash
npm install
```

```bash
npm run start
```

## Issues

Kindly open an issue at [https://github.com/nondefyde/react-social-auth/issues](https://github.com/nondefyde/react-social-auth/issues). We are here and willing to dedicate our time to assist you.

## Contributors ✨

We extend our gratitude to these exceptional individuals:([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/nondefyde"><img src="https://avatars.githubusercontent.com/u/5082938?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Okafor Emmanuel</b></sub></a></td>
    <td align="center"><a href="https://github.com/dapperwalze"><img src="https://avatars.githubusercontent.com/u/28867948?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Walter Ifeakanwa</b></sub></a></td>
  </tr>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project adheres to the [allcontributors](https://github.com/all-contributors/all-contributors) standard, and we enthusiastically welcome contributions of any nature.