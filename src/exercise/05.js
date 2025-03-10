// useRef and useEffect: DOM interaction
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
// eslint-disable-next-line no-unused-vars
import VanillaTilt from 'vanilla-tilt'

function Tilt({children}) {
  const tiltRef = React.useRef()

  React.useEffect(() => {
    const tiltNode = tiltRef.current
    VanillaTilt.init(tiltNode, {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    })
    return function cleanup() {
      tiltNode.VanillaTilt.destroy()
    }
  }, []) 
  // EMPTY array as dependence: "we do not depend on anything”
  // I dont need to sync the state of the world w/ the state of the app, just need to happen once.

  return (
    <div ref={tiltRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Tilt>  
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  )
}

export default App
