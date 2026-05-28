// client/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';


const ProtectedRoute = () => {
  const {isAdmin} = useSelector((state) => state.auth)


  

  return (
    <Box>
      {
        isAdmin && (
          <Outlet />
        )
      }

    </Box>
  )
};

export default ProtectedRoute;