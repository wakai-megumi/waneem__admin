import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { Authcontextprovider } from '../src/context/Authcontext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Authcontextprovider >
      <App />

    </Authcontextprovider>
  </React.StrictMode>,
)
