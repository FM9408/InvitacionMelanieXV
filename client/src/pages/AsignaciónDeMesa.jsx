import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MesaCirculo from '../components/mesacirculo';
import MesasDrawer from '../components/measaDrawer';

// 1. IMPORTACIÓN DEL POLYFILL CONDICIONAL
import { polyfill } from 'mobile-drag-drop';
import 'mobile-drag-drop/default.css';

if (typeof window !== 'undefined') {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        polyfill({
            dragImageTranslateOverride: (event, hoverTarget, computedStyle) => {
                return { x: 0, y: 0 };
            }
        });
    }
}

import { setMesasData } from '../store/slices/mesasSlice';
import { updateMiembroMesa, assignarMesas } from '../store/slices/familiesSlice';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

/**
 * VISTA 1: Plano General
 */
export function SeatingChart(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { familias } = useSelector((state) => state.familias);
    const [timer, setTimer] = React.useState(true)
    const { mesasData } = useSelector((state) => state.mesas);

    // CORRECCIÓN 1: useEffect en lugar de useMemo para acciones con efectos secundarios (side-effects)
    const changeInterval = setInterval(() => { 
        setTimer(!timer)
    }, 15000)
    React.useEffect(() => {
        return () => clearInterval(changeInterval)
     }, [changeInterval])
    return (
        <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant='h4' align='center' sx={{ fontFamily: 'serif', mb: 6, color: '#1a1a1a' }}>
                Plano de Asignación
            </Typography>

            <Grid container spacing={3} justifyContent='center' alignItems='center' direction={'column'}>
                <Grid item xs={12} lg={4}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <MesaCirculo key={n} numero={n} timer={timer} count={mesasData[n]?.length || 0} navigate={navigate} />
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Paper
                        variant='outlined'
                        sx={{
                            height: 300,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed #D4AF37',
                            bgcolor: 'rgba(212, 175, 55, 0.05)',
                            borderRadius: 4,
                        }}
                    >
                        <Typography variant='h6' sx={{ color: '#D4AF37', letterSpacing: 5 }}>
                            PISTA
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        {[8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                            <MesaCirculo key={n} timer={timer } numero={n} count={mesasData[n]?.length || 0} navigate={navigate} />
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={2} justifyContent='center' alignItems='center'>
                        <Grid item>
                            <Button onClick={() => dispatch(assignarMesas(familias))} variant='contained'>Guardar cambios</Button>
                        </Grid>
                        <Grid item>
                            <Button variant='contained' onClick={() => navigate(-1)}>
                                Descartar Cambios
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

/**
 * VISTA 2: Asignación Individual (Optimizada para rendimiento táctil)
 */
export const TableAssignment = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const mesaId = Number(id);
    const [llena, setllena] = React.useState(false);
    const { sinMesa, mesasData } = useSelector((state) => state.mesas);
    
    const invitadosEnMesa = useMemo(() => mesasData[mesaId] || [], [mesasData, mesaId]);

    // CORRECCIÓN 2: Guardar la longitud actual en una Ref para evitar romper la memorización de useCallback en cada render
    const invitadosLengthRef = useRef(invitadosEnMesa.length);
    useEffect(() => {
        invitadosLengthRef.current = invitadosEnMesa.length;
    }, [invitadosEnMesa.length]);

    const onDrop = useCallback((e, destinoMesa) => {
        if (destinoMesa !== 0 && invitadosLengthRef.current === 10) {
            setllena(true);
            setTimeout(() => setllena(false), 8000);
        } else {
            e.preventDefault();
            const invId = e.dataTransfer.getData('invitadoId') || e.dataTransfer.getData('text/plain');
            if (invId) {
                dispatch(updateMiembroMesa({ invitadoId: invId, nuevaMesa: destinoMesa }));
            }
        }
    }, [dispatch]); // El callback ahora es estático y no se recrea constantemente

    // CORRECCIÓN 3: Cambiado useMemo por useEffect. Despachar acciones dentro de un render síncrono ralentiza severamente a React
    
    // Bloqueo eficiente de scroll para móviles
    useEffect(() => {
        const preventDefault = (e) => {
            if (e.target.closest('[draggable="true"]')) {
                e.preventDefault(); 
            }
        };
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            window.addEventListener('touchmove', preventDefault, { passive: false });
        }
        return () => window.removeEventListener('touchmove', preventDefault);
    }, []);

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Alert
                severity='error'
                variant='filled'
                sx={{
                    position: 'absolute',
                    top: llena ? 0 : '-100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: llena ? '10%' : '0%',
                    width: '100%',
                    zIndex: 9999,
                    transition: 'all 0.4s ease-out', // Suavizado de la animación para no congelar la GPU
                }}
            >
                ¡Esta mesa está llena!
            </Alert>
            
            <MesasDrawer onDrop={onDrop} sinMesa={sinMesa} mesaId={mesaId} />

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0', width: '65%' }}>
                <Box
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
                    }}
                    onDragEnter={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        onDrop(e, mesaId);
                    }}
                    sx={{
                        position: 'relative',
                        width: 450,
                        height: 450,
                        borderRadius: '50%',
                        border: '10px solid #D4AF37',
                        bgcolor: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant='h2' sx={{ color: '#D4AF37', opacity: 0.3, fontWeight: 'bold' }}>
                        {id}
                    </Typography>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        Arrastra aquí
                    </Typography>

                    {invitadosEnMesa.map((inv, index) => {
                        const angle = (index / invitadosEnMesa.length) * (2 * Math.PI);
                        const radius = 260;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <Box
                                key={inv.id}
                                draggable="true"
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', inv.id);
                                    e.dataTransfer.setData('invitadoId', inv.id);
                                }}
                                sx={{
                                    position: 'absolute',
                                    transform: `translate3d(${x}px, ${y}px, 0)`, // Usar translate3d delega el renderizado a la GPU
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'secondary.dark',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    fontSize: '1.75rem',
                                    boxShadow: 4,
                                    cursor: 'grab',
                                    zIndex: 10,
                                    p: 1,
                                    border: '2px solid white',
                                    touchAction: 'none', 
                                    WebkitUserSelect: 'none',
                                    userSelect: 'none',
                                    willChange: 'transform' // Le avisa al navegador que este elemento se va a mover
                                }}
                            >
                                {inv.nombre.split(' ')[0]}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};