import { createSlice } from '@reduxjs/toolkit';



function fasterRender (state, familias) {
     const _mapping = {};
     const _sinMesa = [];
     for (const familia of familias) {
         if (!familia.miembros) continue;

         for (const miembro of familia.miembros) {
             if(miembro.willAssist === "Rechazada") continue
             const m = miembro.mesa;
             if (!m || m === 0 && miembro.willAssist === 'Confirmado') {
                 _sinMesa.push(miembro);
             } else {
                 if (!_mapping[m]) _mapping[m] = [];
                 _mapping[m].push(miembro);
             }
         }
    }
    state.mesasData = _mapping;
    state.sinMesa = _sinMesa;
    
}



const initialState = {
    mesasData: [],
    sinMesa: [],
    loading: false,
    error: null,
};

const imagesSlice = createSlice({
    name: 'mesas',
    initialState,
    reducers: {
        setMesasData: (state, action) => {
            fasterRender(state, action.payload);
        },
        
        setSinMesas: (state, action) => {
            fasterRender(state, action.payload);
        },
        
       
    },
    
});

export const { setMesasData, setSinMesas, updateMesasData } = imagesSlice.actions;
export default imagesSlice.reducer;
