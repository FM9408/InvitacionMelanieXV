import React from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store';
import { Provider } from 'react-redux';
import InvitationThemeProvider from './theme';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import axios from 'axios';
import { videoFeatures } from '@videojs/react/video';
import { createPlayer } from '@videojs/react';

export const Player = createPlayer({ features: videoFeatures });

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Player.Provider>
      {/* Everything inside can access the player store */}
     <InvitationThemeProvider >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </InvitationThemeProvider>
    </Player.Provider>
    </Provider>
  </React.StrictMode>,
)
