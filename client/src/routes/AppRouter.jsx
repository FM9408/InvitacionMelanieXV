import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App.jsx';
import { Typography } from '@mui/material'



const AppRouter = () => {
  return (
    
      <Routes>
        <Route path="/" element={
            <Typography variant='h1' fontFamily={"Imperial Script"} align="center" sx={{ mt: 4 }}>
              Proximanente...
            </Typography>
        } />
        {/* Ruta dinámica para el ID del invitado de PostgreSQL */}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    
  );
};

export default AppRouter;