// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// // import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig.js'

import App from './App'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider authConfig={authConfig}
                loadingComponent={<div>Loading...</div>}>
  <Provider store={store}>
    <App />
  </Provider>
  </AuthProvider>,
)
