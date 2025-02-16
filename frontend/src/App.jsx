import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <main className='text-center flex-grow h-full'>
          <Outlet />
        </main>
  )

}

export default App
