import React from "react";

export type GreetProp = {
    message: string;
}

declare const Greet: React.FC<GreetProp>;

export default Greet;
