import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  datos: null,
  loading: false,
  error: null,
};

export const invitadoSlice = createSlice({
  name: 'invitado',
  initialState,
  reducers: {
    setInvitado: (state, action) => {
      state.datos = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setInvitado, setLoading } = invitadoSlice.actions;
export default invitadoSlice.reducer;