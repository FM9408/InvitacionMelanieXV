import React from "react"
import { Box, Typography, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"



export const CardMensaje = ({ m, theme }) => (
    <Box
        sx={{
            flex: "0 0 auto", // Evita que la tarjeta se encoja
            width: { xs: "280px", sm: "320px" }, // Tamaño perfecto para lectura
            minHeight: "250px", // Altura uniforme
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            border: `2px solid ${theme.palette.secondary.main}`,
            boxShadow: `8px 8px 0px 0px ${theme.palette.secondary.dark}`, // Sombra sólida tipo "brutalista"
            p: 2,
            borderRadius: '8px'
        }}
    >
        <IconButton
            size='small'
            color='error'
            sx={{ position: 'absolute', top: 5, right: 5 }}
        >
            <DeleteIcon fontSize='small' />
        </IconButton>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography
                variant='h6'
                sx={{
                    color: theme.palette.secondary.main,
                    fontWeight: 'bold',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    pb: 1,
                    mb: 2,
                    textAlign: 'center'
                }}
            >
                Familia {m.familia}
            </Typography>

            <Typography
                sx={{
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    flexGrow: 1,
                    overflowY: 'auto',
                    maxHeight: '120px', // Limita el texto largo sin romper la tarjeta
                    pr: 1,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word'
                }}
            >
                "{m.mensaje}"
            </Typography>

            <Typography
                variant='caption'
                sx={{
                    mt: 2,
                    color: theme.palette.text.secondary,
                    textAlign: 'right',
                    fontWeight: 'bold'
                }}
            >
                {m.date < 60 
                    ? `Hace ${m.enviadoHace} min` 
                    : `Hace ${Math.floor(m.enviadoHace/60)} hrs`}
            </Typography>
        </Box>
    </Box>
);