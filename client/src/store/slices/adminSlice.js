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
    currentUSer:[],
    loadingAdmin: true,
    error: null,
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        deleteFamiliaLocal: (state, action) => {
            state.invitados = state.invitados.filter(
                (familia) => familia.id !== action.payload
            )
        },
            addFamiliaLocal: (state, action) => {
                state.invitados = state.invitados.concat(action.payload)
        },
            setCurrentUser: (state, action) => {
                state.currentUSer = action.payload
            }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInvitados.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchInvitados.fulfilled, (state, action) => {
            state.invitados = action.payload
            state.loadingAdmin = false
        })
        builder.addCase(fetchInvitados.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const { deleteFamiliaLocal, addFamiliaLocal, setCurrentUser } = adminSlice.actions

export default adminSlice.reducer
