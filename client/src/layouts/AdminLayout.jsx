import { Box } from '@mui/material'
import GuestListModule from '../modules/GuestList/GuestListModule'
import Appbar from '../components/Appbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const AdminLayout = () => {
    return (
        <Box>
            <Appbar />
            {/* Reducimos el padding en móviles (px: 1) y lo aumentamos en desktop (px: 3) */}
            <Box component='main' sx={{ mt: 2 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    )
}

export default AdminLayout
