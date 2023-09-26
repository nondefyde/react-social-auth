import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { FacebookProvider } from './lib/Facebook';

ReactDOM.render(
    <React.StrictMode>
        <FacebookProvider appId={'123456'}>
            <App />
        </FacebookProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
