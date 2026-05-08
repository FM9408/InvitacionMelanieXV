// client/src/layouts/UserLayout.jsx
import { Outlet } from 'react-router-dom'
// import SnowEffect from '../components/SnowEffect';
import { Box } from '@mui/material'


const UserLayout = () => {
    return (
        <Box sx={{ position: 'relative', minHeight: '100vh',  }}>
            {/* La nieve vive en una capa detrás del contenido */}
            {/* <SnowEffect /> */}

            <Box sx={{ position: 'relative', zIndex: 1,}}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default UserLayout
