import React from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store';
import { Provider } from 'react-redux';
import InvitationThemeProvider from './theme';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import axios from 'axios';


axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`

console.log(axios.defaults.baseURL)
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <InvitationThemeProvider >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </InvitationThemeProvider>
    </Provider>
  </React.StrictMode>,
)
