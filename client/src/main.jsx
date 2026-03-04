import React from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store';
import { Provider } from 'react-redux';
import InvitationThemeProvider from './theme';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import AppRouter from './routes/AppRouter.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <InvitationThemeProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </InvitationThemeProvider>
    </Provider>
  </React.StrictMode>,
)
