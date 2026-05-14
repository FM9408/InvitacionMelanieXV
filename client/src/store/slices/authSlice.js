import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {
        id: '',
        email:'',
        apellido: '',
        miembros: [],
    },
    isAdmin: false,
    loading: true,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.isAdmin = action.payload
            
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { setAdmin, setUser } = authSlice.actions
export default authSlice.reducer
