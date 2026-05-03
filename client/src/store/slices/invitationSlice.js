import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    datos: {miembros: []},
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
        setAssist: (state, action) => { 
            state.datos.miembros.forEach(miembro => {
                if (miembro.id === action.payload) {
                    miembro.isConfirmed = "Confirmado"
                }
             })
        },
        setAbsent: (state, action) => { 
            state.datos.miembros.forEach((miembro) => {
                if (miembro.id === action.payload) {
                    miembro.isConfirmed = 'Declinado';
                }
            });
        }
    }
})

export const { setInvitado, setLoading } = invitadoSlice.actions
export default invitadoSlice.reducer
