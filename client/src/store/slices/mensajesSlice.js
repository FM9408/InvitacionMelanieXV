import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const sendMensaje = createAsyncThunk(
    'mensajes/sendMensaje',
    async (info) => {
        const response = await axios.post(
            `http://localhost:8080/api/mensajes/sendMensaje/${info.id}`,
            {
                mensaje: info.mensaje,
            }
        );
        return response.data;
    })
export const fetchMensajes = createAsyncThunk(
    'mensajes/fetchMensajes',
    async () => {
       
            const response = await axios.get(
                `${axios.defaults.baseURL}/api/mensajes/getAll`
        )
     
            return response.data
       
    })


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
            state.mensajes = state.mensajes.filter(mensaje => mensaje.id !== action.payload.id)
            state.mensajes.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendMensaje.pending, (state) => {
            state.loadingMensajes = true;
        });
        builder.addCase(sendMensaje.fulfilled, (state, action) => {
            state.mensajes= [...state.mensajes, action.payload];
            state.loadingMensajes = false;
        });
        builder.addCase(sendMensaje.rejected, (state, action) => {
            state.loadingMensajes = false;
            state.error = action.error.message;
        });
        builder.addCase(fetchMensajes.pending, (state) => {
            state.loadingMensajes = true;
        });
        builder.addCase(fetchMensajes.fulfilled, (state, action) => {
            state.mensajes = action.payload;
            state.loadingMensajes = false;
        });
        builder.addCase(fetchMensajes.rejected, (state, action) => {
            state.loadingMensajes = false;
            state.error = action.error.message;
        });
       
    },
    
}
    
)
export const { setMensajes } = mensajesSlice.actions

export default mensajesSlice.reducer
