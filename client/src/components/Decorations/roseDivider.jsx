import React from "react";
import {Box} from "@mui/material"



export default function RoseDevider () {
    return (
            <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {/* Línea izquierda con brillo */}
                            <Box
                                sx={{
                                    flex: 1,
                                    height: '2px',
                                    background:
                                        'linear-gradient(90deg, transparent, #D4AF37)',
                                    boxShadow: '0 0 10px #D4AF37'
                                }}
                            />

                            {/* El Icono central: Una Rosa Estilizada en SVG */}
                            <Box sx={{ mx: 4, position: 'relative' }}>
                                <svg
                                    width='50'
                                    height='50'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M12 22C12 22 17 18 17 13C17 10 14 8 12 8C10 8 7 10 7 13C7 18 12 22 12 22Z'
                                        fill='#850000'
                                        stroke='#D4AF37'
                                        strokeWidth='1'
                                    />
                                    <path
                                        d='M12 8C12 8 12 2 15 2C18 2 19 5 17 7C16 8 12 8 12 8Z'
                                        fill='#A30000'
                                        opacity='0.8'
                                    />
                                    <path
                                        d='M12 8C12 8 12 2 9 2C6 2 5 5 7 7C8 8 12 8 12 8Z'
                                        fill='#A30000'
                                        opacity='0.8'
                                    />
                                </svg>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    height: '2px',
                                    background:
                                        'linear-gradient(90deg, #D4AF37, transparent)',
                                    boxShadow: '0 0 10px #D4AF37'
                                }}
                            />
                        </Box>
    )
}