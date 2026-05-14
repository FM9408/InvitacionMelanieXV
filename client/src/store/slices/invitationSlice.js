import { createSlice } from '@reduxjs/toolkit'

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

        
    }
})

export const { setInvitado, setLoading, setImages, setConfirmationNotifications} = invitadoSlice.actions
export default invitadoSlice.reducer
