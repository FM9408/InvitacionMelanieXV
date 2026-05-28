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
export const deleteFamiliaFromDB = createAsyncThunk(
    'admin/deleteFamilia',
    async ({ id, conserve }) => {
        const response = await axios.delete(
            `${axios.defaults.baseURL}/api/invitados/borrarFamilia/${id}?conserveMensajes=${conserve}`
        );
        if (response.status !== 200) {
            throw new Error('Failed to delete familia')
        }
        return response.data
    }
)

export const getNotifications = createAsyncThunk(
    'admin/getNotifications',
    async () => {
        const response = await axios.get(
            `${axios.defaults.baseURL}/api/notificaciones`
        );
        if (response.status !== 200) {
            throw new Error('Failed to get notifications')
        }
        return response.data
    })



const initialState = {
    invitados: [],
    currentUSer: [],
    notifications: [],
    loadingAdmin: true,
    loadingDataAdmin: true,
    error: null,
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        deleteFamilia: (state, action) => {
            state.invitados = state.invitados.filter(
                (familia) => familia.id !== action.payload
            )
           
            
           
        },
            addFamiliaLocal: (state, action) => {
                state.invitados = state.invitados.concat(action.payload)
        },
            setCurrentUser: (state, action) => {
                state.currentUSer = action.payload
        },
            setInvitados: (state, action) => {
                state.invitados = action.payload
        },
            setNotifications: (state, action) => {
                state.notifications = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInvitados.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchInvitados.fulfilled, (state, action) => {
            state.invitados = action.payload
            state.loadingDataAdmin= false
        })
        builder.addCase(fetchInvitados.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
        builder.addCase(deleteFamiliaFromDB.pending, (state) => {
            state.loading = true
        })
        builder.addCase(deleteFamiliaFromDB.fulfilled, (state) => {
            state.loading = false
        })
        builder.addCase(deleteFamiliaFromDB.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
        builder.addCase(getNotifications.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload
            state.loading = false
        })
        builder.addCase(getNotifications.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const { deleteFamilia, addFamiliaLocal, setCurrentUser,setInvitados, setNotifications } = adminSlice.actions

export default adminSlice.reducer
