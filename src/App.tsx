import React from 'react'
import { Greet, useFacebookConnect } from './lib'

function App() {
  const { isLoading, onFacebookConnect, facebookData } = useFacebookConnect({
    isBusiness: false,
  })

  console.log('facebook data:::', facebookData, isLoading)

  return (
    <>
      Hello <Greet message={'Greeting here'} />
      <button onClick={onFacebookConnect}>Connect to Facebook</button>
    </>
  )
}

export default App
