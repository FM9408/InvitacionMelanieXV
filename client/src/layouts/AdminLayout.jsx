import React from 'react'
import { Box } from '@mui/material';

import Appbar from '../components/Appbar'

import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const AdminLayout = () => {
    
    
   
    return (
        <Box>
            <Box sx={{ position: 'relative', zIndex: 1, mb:3}}>
                <Appbar />
            </Box>
            {/* Reducimos el padding en móviles (px: 1) y lo aumentamos en desktop (px: 3) */}
            <Box component='main' sx={{ mt: 2, pt:2 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    )
}

export default AdminLayout
