import React from 'react'
import { Box } from '@mui/material';
import GuestListModule from '../modules/GuestList/GuestListModule'
import Appbar from '../components/Appbar'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const AdminLayout = () => {
    const {familias} = useSelector((state) => state.familias)
    const { invitados } = useSelector((state) => state.admin)
    
    const {mensajes} = useSelector((state) => state.mensajes)
    
    React.useEffect(() => { }, [familias, mensajes])
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
