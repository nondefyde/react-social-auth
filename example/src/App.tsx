import { useState } from 'react';
import './App.css';
import Greet from '../../package/src/lib/Greet';
import { useFacebookConnection } from '../../package/src/lib/Facebook'


function App() {
    const [count, setCount] = useState(0);
    const { onFacebookConnect, facebookData } = useFacebookConnection({
        isBusiness: false,
    })

    return (
        <div className="App">
            <header className="App-header">
                <Greet message={'testing greeting here'}
                    description={'testing description here'} />
                <button onClick={onFacebookConnect}>Connect to Facebook</button>
            </header>
        </div>
    );
}

export default App;
