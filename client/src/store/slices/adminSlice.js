import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchInvitados = createAsyncThunk(
    'admin/fetchInvitados',
    async () => {
       
        const response = await axios.get(
            `${axios.defaults.baseURL}/api/invitados/getFamiles`
        )
        if (response.status !== 200) {
            throw new Error('Failed to fetch invitados')
        }
       
        return response.data
    }
)
export const deleteFamilia = createAsyncThunk(
    'admin/deleteFamilia',
    async (id) => {
        const response = await axios.delete(
            `${axios.defaults.baseURL}/api/invitados/borrarFamilia/${id}`
        )
        if (response.status !== 200) {
            throw new Error('Failed to delete familia')
        }
        return response.data
    }
)


const initialState = {
    invitados: [],
    loadingAdmin: true,
    error: null,
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchInvitados.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchInvitados.fulfilled, (state, action) => {
            state.invitados = action.payload
            state.loading = false
        })
        builder.addCase(fetchInvitados.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export default adminSlice.reducer
