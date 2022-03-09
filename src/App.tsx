import ThreeCanvas from './ThreeCanvas-shader'
import './App.css'
import { Suspense } from 'react'

const App = () => {
  return (
    <div
      className='App'
      style={{ height: '100vh', width: '100vw' }}>
      <Suspense fallback={null}>
        <ThreeCanvas />
      </Suspense>
    </div>
  )
}

export default App
