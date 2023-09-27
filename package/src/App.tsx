import {Fragment} from "react";
import {Greet} from "./lib";
import { useFacebookConnection } from "./lib/Facebook";

function App() {
    const { onFacebookConnect, facebookData } = useFacebookConnection({
        isBusiness: false,
    })
    return (
        <Fragment>
            <Greet message={'hello here'} />
            <button onClick={onFacebookConnect}>Connect to Facebook</button>
        </Fragment>
    );
}

export default App;
