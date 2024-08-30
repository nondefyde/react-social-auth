import { Greet } from './lib';
import { useFacebookConnection } from './lib/Facebook';

function App() {
    const { onFacebookConnect, facebookData } = useFacebookConnection({});
    return (
        <>
            <Greet message={'hello here'} />
            <button onClick={onFacebookConnect}>Connect to Facebook</button>
        </>
    );
}

export default App;
