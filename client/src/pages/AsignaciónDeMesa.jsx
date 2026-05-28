import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import MesaCirculo from '../components/mesacirculo';
import MesasDrawer from '../components/measaDrawer';

// IMPORTACIÓN DEL POLYFILL CONDICIONAL PARA MÓVILES
import { polyfill } from 'mobile-drag-drop';
import 'mobile-drag-drop/default.css';

if (typeof globalThis !== 'undefined') {
    const isTouchDevice =
        'ontouchstart' in globalThis || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        polyfill({
            dragImageTranslateOverride: (event, hoverTarget, computedStyle) => {
                return { x: 0, y: 0 };
            },
        });
    }
}

import { setMesasData } from '../store/slices/mesasSlice';
import {
    updateMiembroMesa,
    assignarMesas,
    setFamilias,
} from '../store/slices/familiesSlice';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { setInvitados } from '../store/slices/adminSlice';
import { setError } from '../store/slices/mensajesSlice';

/**
 * VISTA 1: Plano General
 */
export function SeatingChart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { familias } = useSelector((state) => state.familias);
    const { invitados } = useSelector((state) => state.admin);
    const { mesasData } = useSelector((state) => state.mesas);

    useEffect(() => {
        dispatch(setMesasData(familias));
    }, [familias, dispatch]);

    return (
        <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography
                variant='h4'
                align='center'
                sx={{ fontFamily: 'serif', mb: 6, color: '#1a1a1a' }}
            >
                Plano de Asignación
            </Typography>

            <Grid
                container
                spacing={3}
                justifyContent='center'
                alignItems='center'
                direction={'column'}
            >
                <Grid item xs={12} lg={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            justifyContent: 'center',
                        }}
                    >
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <MesaCirculo
                                key={n}
                                numero={n}
                                count={mesasData[n]?.length || 0}
                                navigate={navigate}
                            />
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
                        <Typography
                            variant='h6'
                            sx={{ color: '#D4AF37', letterSpacing: 5 }}
                        >
                            PISTA
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            justifyContent: 'center',
                        }}
                    >
                        {[8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                            <MesaCirculo
                                key={n}
                                numero={n}
                                count={mesasData[n]?.length || 0}
                                navigate={navigate}
                            />
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent='center'
                        alignItems='center'
                    >
                        <Grid item>
                            <Button
                                onClick={() => {
                                   
                                    dispatch(assignarMesas(familias));
                                }}
                                variant='contained'
                            >
                                Guardar cambios
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant='contained'
                                onClick={async () => {
                                    try {
                                        dispatch(setFamilias(invitados));
                                        dispatch(setMesasData(invitados));
                                    } catch (error) {
                                        setError()
                                    }
                                }}
                            >
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
 * VISTA 2: Asignación Individual (REDISEÑADA PARA SE TRADUZCA EXCELENTE EN MÓVIL)
 */
export const TableAssignment = () => {
    const { id } = useParams();
    const familias = useSelector((state) => state.familias.familias);
    const dispatch = useDispatch();
    const mesaId = Number(id);
    const [llena, setllena] = React.useState(false);
    const { sinMesa, mesasData } = useSelector((state) => state.mesas);
    const invitadosEnMesa = useMemo(
        () => mesasData[mesaId] || [],
        [mesasData, mesaId]
    );

    // Detector estricto de pantallas móviles
    const isMobile = useMediaQuery('(max-width:600px)');

    // ESCALA MATEMÁTICA CORREGIDA: Evita el desborde en pantallas de 360px-400px
    const tableSize = isMobile ? 180 : 450; // Diámetro del círculo de la mesa blanca
    const radius = isMobile ? 120 : 260; // Distancia del centro a los invitados (Radio orbital)
    const guestSize = isMobile ? 55 : 80; // Diámetro de cada burbuja de invitado

    const invitadosLengthRef = useRef(invitadosEnMesa.length);
    useEffect(() => {
        invitadosLengthRef.current = invitadosEnMesa.length;
    }, [invitadosEnMesa.length]);

    const onDrop = useCallback(
        (e, destinoMesa) => {
            if (destinoMesa !== 0 && invitadosLengthRef.current === 10) {
                setllena(true);
                setTimeout(() => setllena(false), 8000);
            } else {
                e.preventDefault();
                const invId =
                    e.dataTransfer.getData('invitadoId') ||
                    e.dataTransfer.getData('text/plain');
                if (invId) {
                  
                    dispatch(
                        updateMiembroMesa({
                            invitadoId: invId,
                            nuevaMesa: destinoMesa,
                        })
                    );
                }
            }
        },
        [dispatch]
    );

    useEffect(() => {
        dispatch(setMesasData(familias));
        const preventDefault = (e) => {
            if (e.target.closest('[draggable="true"]')) {
                e.preventDefault();
            }
        };
        if ('ontouchstart' in globalThis || navigator.maxTouchPoints > 0) {
            globalThis.addEventListener('touchmove', preventDefault, {
                passive: false,
            });
        }
        return () =>
            globalThis.removeEventListener('touchmove', preventDefault);
    }, [familias]);

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                flexDirection: isMobile ? 'column-reverse' : 'row', // En móvil, el Drawer va abajo para no estorbar
            }}
        >
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
                    transition: 'all 0.4s ease-out',
                }}
            >
                ¡Esta mesa está llena!
            </Alert>

            <MesasDrawer onDrop={onDrop} sinMesa={sinMesa} mesaId={mesaId} />

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column', // Apilado vertical para acomodar el nuevo rótulo
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#f0f0f0',
                    width: isMobile ? '100%' : '65%',
                    height: isMobile ? '65vh' : '100%',
                    gap: isMobile ? 2 : 4,
                    p: 2,
                }}
            >
                {/* ROTULO SUPERIOR CON EL NÚMERO DE MESA INDEPENDIENTE */}
                <Box
                    sx={{
                        bgcolor: '#D4AF37',
                        color: 'white',
                        px: isMobile ? 3 : 5,
                        py: 1,
                        mb: 7,
                        borderRadius: '30px',
                        boxShadow: '0 4px 15px rgba(212, 175, 55, 0.25)',
                    }}
                >
                    <Typography
                        variant={isMobile ? 'subtitle1' : 'h4'}
                        sx={{
                            fontFamily: 'serif',
                            fontWeight: 'bold',
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                        }}
                    >
                        Mesa {id}
                    </Typography>
                </Box>

                {/* CONTENEDOR DE LA MESA (ESPACIO CENTRAL) */}
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
                        width: tableSize,
                        height: tableSize,
                        borderRadius: '50%',
                        border: `${isMobile ? '6px' : '10px'} solid #D4AF37`,
                        bgcolor: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* <Typography
                        variant={isMobile ? 'h3' : 'h2'}
                        sx={{
                            color: '#D4AF37',
                            opacity: 1,
                            fontWeight: 'bold',
                        }}
                    >
                         Mesa {id}
                    </Typography> */}

                    <Typography
                        variant='caption'
                        sx={{
                            color: 'text.secondary',
                            display: isMobile ? 'flex' : 'block',
                        }}
                    >
                        Arrastra aquí
                    </Typography>

                    {/* RENDERIZADO ORBITAL DE INVITADOS CON MEDIDAS CORREGIDAS */}
                    {invitadosEnMesa.map((inv, index) => {
                        const angle =
                            (index / invitadosEnMesa.length) * (2 * Math.PI);
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <Box
                                key={inv.id}
                                draggable='true'
                                onDragStart={(e) => {
                                    e.dataTransfer.setData(
                                        'text/plain',
                                        inv.id
                                    );
                                    e.dataTransfer.setData(
                                        'invitadoId',
                                        inv.id
                                    );
                                }}
                                sx={{
                                    position: 'absolute',
                                    transform: `translate3d(${x}px, ${y}px, 0)`,
                                    width: guestSize,
                                    height: guestSize,
                                    borderRadius: '50%',
                                    bgcolor: 'secondary.dark',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    fontSize: isMobile ? '0.65rem' : '1rem', // Texto compacto y legible en celular
                                    fontWeight: 'bold',
                                    boxShadow: 3,
                                    cursor: 'grab',
                                    zIndex: 0,
                                    p: 0.5,
                                    border: '1.5px solid white',
                                    touchAction: 'none',
                                    WebkitUserSelect: 'none',
                                    userSelect: 'none',
                                    willChange: 'transform',
                                    wordBreak: 'break-word', // Evita que nombres largos rompan el círculo
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
