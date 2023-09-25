import { useState } from 'react';
import './App.css';
import Greet from '../../package/src/lib/Greet'

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
            <header className="App-header">
                <Greet message={'testing greeting here'}
                    description={'testing description here'} />
            </header>
        </div>
    );
}

export default App;
