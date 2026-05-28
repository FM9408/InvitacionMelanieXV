import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchInvitadoById = createAsyncThunk(
    'invitado/fetchInvitado',
    async (id) => {
        const response = await axios.get(
            `${axios.defaults.baseURL}/api/invitados/getFamilia/${id}`
        );
        return response.data;
    }
)


const initialState = {
    datos: { miembros: [] },
    images: {},
    confirmationNotifications: [],
    loading: false,
    error: null
}

const invitadoSlice = createSlice({
    name: 'invitado',
    initialState,
    reducers: {
        setInvitado: (state, action) => {
            state.datos = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setImages: (state, action) => {
            state.images = action.payload
        },
        setConfirmationNotifications: (state, action) => {
            state.confirmationNotifications = state.confirmationNotifications.concat(action.payload)

        }

        
    }, extraReducers: (builder) => {
        builder.addCase(fetchInvitadoById.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchInvitadoById.fulfilled, (state, action) => {
            state.datos = action.payload
            state.loading = false
        })
        builder.addCase(fetchInvitadoById.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const { setInvitado, setLoading, setImages, setConfirmationNotifications} = invitadoSlice.actions
export default invitadoSlice.reducer
