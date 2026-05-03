import { createSlice } from '@reduxjs/toolkit'



const initialState = {
    mensajes: [],
    loadingMensajes: true,
    error: null
}

const mensajesSlice = createSlice({
    name: 'mensajes',
    initialState,
    reducers: {
        setMensajes: (state, action) => {
            state.mensajes = action.payload
            state.loadingMensajes = false
            console.log(state.mensajes)
        },
    },
    
})
export const { setMensajes } = mensajesSlice.actions

export default mensajesSlice.reducer
