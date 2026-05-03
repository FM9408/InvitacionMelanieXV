import { configureStore } from '@reduxjs/toolkit'
import mensajesReducer from './slices/mensajesSlice.js'
import invitadoReducer from './slices/invitationSlice.js'
import adminReducer from './slices/adminSlice.js'
import authReducer from './slices/authSlice.js'

export const store = configureStore({
    reducer: {
        invitado: invitadoReducer,
        auth: authReducer,
        admin: adminReducer,
        mensajes: mensajesReducer
    }
})
