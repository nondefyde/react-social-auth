import React, {Fragment} from 'react'

export type GreetProp = {
    message: string
    description?: string
}

const Greet: React.FC<GreetProp> = (props) => {
    const {message, description} = props
    return (
        <Fragment>
            <h1>{message}</h1>
            <p>{description}</p>
        </Fragment>
    )
}

export default Greet
