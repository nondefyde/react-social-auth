
type GreetProp = {
    message: string
}

const Greet = (props: GreetProp) => {
    const {message} = props;
    return (
        <h1>{message}</h1>
    )
};

export default Greet