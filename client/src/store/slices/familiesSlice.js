import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    familias: [],
    loading: false,
    error: null
}


export const AddaFamily = createAsyncThunk(
    'familias/AddaFamily',
    async (familyData) => {
        const response = await axios.post(
            `${axios.defaults.baseURL}/api/invitados/addFamilia`,
            {
                apellido: familyData.nombreFamilia,
                invitados: familyData.invitados
            })
        return response.data
    }
)


const familiesSlice = createSlice({
    name: 'familias',
    initialState,
    reducers: { 
        setFamilias: (state, action) => {
            state.familias = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(AddaFamily.pending, (state) => {
            state.loading = true
        })
        builder.addCase(AddaFamily.fulfilled, (state, action) => {
            state.loading = false
            state.familias = state.familias.concat(action.payload)
        })
        builder.addCase(AddaFamily.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const { setFamilias } = familiesSlice.actions

export default familiesSlice.reducer