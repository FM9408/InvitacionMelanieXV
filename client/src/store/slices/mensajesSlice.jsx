import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendMensaje = createAsyncThunk(
    'mensajes/sendMensaje',
    async ({ id, mensaje}) => {
        
        const response = await axios.post(
            `${axios.defaults.baseURL}/api/mensajes/sendMensaje/${id}`,
            {
                mensaje,
            }
        );
        return response.data;
    }
);
export const fetchMensajes = createAsyncThunk(
    'mensajes/fetchMensajes',
    async () => {
        const response = await axios.get(
            `${axios.defaults.baseURL}/api/mensajes/getAll`
        );

        return response.data;
    }
);

export const deleteMensajeofDB = createAsyncThunk(
    'mensajes/deleteMensajeofDB',
    async (id) => {
        const response = await axios.delete(
            `${axios.defaults.baseURL}/api/mensajes/deleteMensaje/${id}`
        );
        return response.data;
    }
);

const initialState = {
    mensajes: [],
    loadingMensajes: true,
    error: null,
    notifications: []
};

const mensajesSlice = createSlice({
    name: 'mensajes',
    initialState,
    reducers: {
        setMensajes: (state, action) => {
            state.mensajes = state.mensajes.filter((mensaje) => mensaje.id !== action.payload.id);
            state.mensajes.push(action.payload)
            
        },
        setMessagesNotifications: (state, action) => {

            state.notifications = state.notifications.filter((notification) => notification.id !== action.payload.id);
            state.notifications.push(action.payload)
        },
        deleteMensaje: (state, action) => {
            state.mensajes = state.mensajes.filter(
                (mensaje) => mensaje.id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendMensaje.pending, (state) => {
            state.loadingMensajes = true;
        });
        builder.addCase(sendMensaje.fulfilled, (state, action) => {
            state.mensajes = [...state.mensajes, action.payload];
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
        builder.addCase(deleteMensajeofDB.pending, (state) => {
            state.loadingMensajes = true;
        });
        builder.addCase(deleteMensajeofDB.fulfilled, (state, action) => {
            state.mensajes = state.mensajes.filter(
                (mensaje) => mensaje.id !== action.payload.id
            );
            state.loadingMensajes = false;
        });
        builder.addCase(deleteMensajeofDB.rejected, (state, action) => {
            state.error = action.error.message;
            state.loadingMensajes = false;
        });
    },
});
export const { setMensajes,deleteMensaje, setMessagesNotifications } = mensajesSlice.actions;

export default mensajesSlice.reducer;
