import { configureStore } from '@reduxjs/toolkit'
import mensajesReducer from './slices/mensajesSlice.jsx'
import invitadoReducer from './slices/invitationSlice.js'
import adminReducer from './slices/adminSlice.js'
import familiaReducer from './slices/familiesSlice.js'
import authReducer from './slices/authSlice.js'
import imagesReducer from './slices/imagesSlice.js'
import mesasReducer from './slices/mesasSlice.js'



export const store = configureStore({
    reducer: {
        invitado: invitadoReducer,
        auth: authReducer,
        admin: adminReducer,
        mensajes: mensajesReducer,
        images: imagesReducer,
        familias: familiaReducer,
        mesas: mesasReducer
    }
})
