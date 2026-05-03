import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAdmin: true,
    loading: true,
    error: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.isAdmin = action.payload
        }
    }
})

export const { setAdmin } = authSlice.actions
export default authSlice.reducer
