// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

/** We are managing not only errors we get from fetch request (check the component PokemonInfo - status rejected)
 *  but errors we get in runtime from our javascript.
 *
 *  Here we created an error boundary, which we wrapped our info component in - line 95
 *  and the error boundary by default will just render all the children, so it's a regular wrapper, does not do anything
 *  but if there is an error in there, React will search the closest error boundary (the component implementing the static getDerivedStateFromError)
 *  and will passes the error which we can use to set our state, and will trigger a re-render() from the error boundary, with the existing error
 *  in this example, the fallback component it's flexible.
 */

/**
 * YOU DONT NEED TO WRITE THE ERROR BOUNDARY - REACT HAD A LIB FOR THAT -> react-error-boundary
 * BUT IF YOU NEED A CUSTOM ONE, THIS IS HOW YOU WOULD WRITE IT.
 */

// class ErrorBoundary extends React.Component {
//   state = {error: null}

//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   /** anybody using this error boundary, has the flexibility to provide any Fallback component they want.
//    *  which makes this Error Boundary much more generically useful for us
//    */
//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }
//     return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: 'resolved'})
      },
      error => {
        setState({error, status: 'rejected'})
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // this will be handled by our error boundary
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div>
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  /** 
   * When the pokemon name changes, the error boundary will reset itself and re-render the children again.
   * 
   * the reset keys is there so when the errorboundary is on the error state, 
   * it will reset itself if any of the values on the array resetKeys changes.
   */

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
