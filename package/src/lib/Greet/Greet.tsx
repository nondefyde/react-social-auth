export type GreetProp = {
    message: string;
    description?: string;
};

const Greet = (props: GreetProp) => {
    const { message, description } = props;
    return (
        <>
            Another testing
            <h1>{message}</h1>
            <p>{description}</p>
        </>
    );
};

export default Greet;
