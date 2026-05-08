import React from "react";
import { Paper, Typography, Box, Grid, IconButton } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";
import {PersonAdd}from "@mui/icons-material";

function Mesa ({ numero, invitados }) {
    const [numeroDeMesa, setNumeroDeMesa] = React.useState(numero);
    const [invitadosEnMesa, setInvitadosEnMesa] = React.useState(invitados);
    const [hovered, setHovered] = React.useState(false);
    function onHoverHandle () {
        if(invitadosEnMesa.length >= 10) return; // Ejemplo: no permitir agregar más invitados si ya hay 10
        setHovered(true)
    }
    function onLeaveHandle () {
        setHovered(false)
    }

    React.useEffect(() => {
        setNumeroDeMesa(numero);
        setInvitadosEnMesa(invitados);
       
    }, [numero, invitados]);

    return (
        <Paper onMouseLeave={() =>onLeaveHandle()} onMouseEnter={() =>onHoverHandle()} sx={{ p: 2, m: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius:"50%", width: '100%', height: '200px', justifyContent: 'center' }}>
            {
                hovered ? (
                   <IconButton> <PersonAdd  sx={{ fontSize: '2rem', color: 'primary.main', cursor: 'pointer' }} /></IconButton>) : <Box sx={{  }}>
                         <Typography variant="h4">Mesa {numeroDeMesa}</Typography>
            <Typography variant="caption" sx={{width:"100%"}}>Invitados asignados:</Typography>
            {
                invitadosEnMesa.length > 0 ? (
                    <Typography variant="caption">Hay {invitadosEnMesa.length}/10 invitados en esta mesa:</Typography>
                            ) : invitadosEnMesa.length === 10 ? (
                        <Typography variant="caption">Esta mesa esta llena</Typography>
                ):(
                    <Typography variant="caption">No hay invitados asignados en esta mesa.</Typography>
                )
            }
                    </Box>
           }
        </Paper>
    )
}

function AsignaciondeMesas () {
    const { invitados } = useSelector((state) => state.admin)
    const [mesas1, setMesas1] = React.useState(new Array(6).fill().map((_, i) => ({ numero: i + 1, invitados: [] })))
    const [mesas2, setMesas2] = React.useState(new Array(6).fill().map((_, i) => ({ numero: i + 7, invitados: [] })))

    React.useEffect(() => { 
       return () => { invitados.forEach((familia) => {
            familia.miembros.forEach((miembro) => {
                if (miembro.willAssist === "Confirmado") {
                    if (miembro.mesa <= 6) {
                       setMesas1((prevMesas) => {
                            const updatedMesas = [...prevMesas];
                            updatedMesas[miembro.mesa - 1].invitados.push(miembro);
                            return updatedMesas;
                       });
                       
                    } else if (miembro.mesa <= 12) {
                        setMesas2((prevMesas) => {
                            const updatedMesas = [...prevMesas];
                            updatedMesas[miembro.mesa - 7].invitados.push(miembro);
                            return updatedMesas;
                        });
                    }
                }
            })})
        }
    },[invitados])

    return (
        
          <Grid container  justifyContent="center" direction={"row"}>
              <Grid Item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  flexDirection:"column", width:`${100/3}%` }}>
                 {
                mesas1.map((mesa) => {
                    return (
                        <Mesa key={mesa.numero} numero={mesa.numero} invitados={mesa.invitados} />
                    )
                })
            }
           </Grid>
            <Grid Item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:`${100/3}%`, }}>
                <svg width="100%" height="100%">
                    <rect x="10" y="10" width="100%" height="100%" fill="#ccc" stroke="#333" strokeWidth="2" />
                </svg>
                </Grid>
                 <Grid Item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',   flexDirection:"column", width:`${100/3}%` }}>
                 {
                mesas2.map((mesa) => {
                    return (
                        <Mesa key={mesa.numero} numero={mesa.numero} invitados={mesa.invitados} />
                    )
                })
            }
           </Grid>
          </Grid>
        
    );
}
 


export default AsignaciondeMesas