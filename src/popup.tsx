import React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'

const rootEl = document.createElement('div')
document.body.append(rootEl)

const root = ReactDOM.createRoot(rootEl)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
