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

export const assignarMesas = createAsyncThunk(
    'familias/assignarMesas',
    async (familias) => {
        const response = await axios.put(
            `${axios.defaults.baseURL}/api/invitados/asignarMesa`,
            { familias }
        )
        return response.data    
    }
)

export const actualizarFamilia = createAsyncThunk(
    'familias/actualizarFamilia',
    async (familiaData, thunkAPI) => {
        const response = await axios.put(
            `${axios.defaults.baseURL}/api/invitados/modificarFamilia`,
            {
                ...familiaData,
            }
            
        )
        return response.data
    }
)
        


const familiesSlice = createSlice({
    name: 'familias',
    initialState,
    reducers: {
        setFamilias: (state, action) => {
            state.familias = action.payload;
        },
        updateMiembroMesa: (state, action) => {
            const { invitadoId, nuevaMesa } = action.payload;
            console.log(action.payload)
            state.familias.forEach((familia) => {
                const miembro = familia.miembros.find(
                    (m) => m.id === invitadoId
                );
                if (miembro) {
                    miembro.mesa = nuevaMesa;
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(AddaFamily.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(AddaFamily.fulfilled, (state, action) => {
            state.loading = false;
            state.familias = state.familias.concat(action.payload);
        });
        builder.addCase(AddaFamily.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(assignarMesas.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(assignarMesas.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(assignarMesas.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(actualizarFamilia.pending, (state) => {
            state.loading = true;
            
        });
        builder.addCase(actualizarFamilia.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(actualizarFamilia.rejected, (state, action) => {    
            state.error = action.error.message;
        });
    },
});

export const { setFamilias, updateMiembroMesa } = familiesSlice.actions

export default familiesSlice.reducer