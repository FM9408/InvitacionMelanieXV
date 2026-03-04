import { configureStore } from '@reduxjs/toolkit';
import invitadoReducer from './slices/invitationSlice.js';

export const store = configureStore({
  reducer: {
    invitado: invitadoReducer,
  },
});