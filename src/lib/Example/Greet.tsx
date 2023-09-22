import React from 'react';

export type GreetProp = {
  message: string
}

const Greet: React.FC<GreetProp> = (props) => {
  const { message } = props
  return <h1>{message}</h1>
}

export default Greet
