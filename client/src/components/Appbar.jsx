import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'

export default function Appbar() {
    return (
        <AppBar variant='admin'>
            <Toolbar>
                <Typography
                    variant='h6'
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.1rem', sm: '1.5rem' } // Responsive font size
                    }}
                >
                    Melanie XV Admin
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
