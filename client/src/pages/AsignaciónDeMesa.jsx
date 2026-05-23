import React, { useMemo, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery'; // Detectar pantalla móvil
import MesaCirculo from '../components/mesacirculo';
import MesasDrawer from '../components/measaDrawer';

// Importa tus acciones
import { invitadosFetch, renderMesasData } from '../App';
import { updateMiembroMesa, assignarMesas } from '../store/slices/familiesSlice';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

/**
 * VISTA 1: Plano General
 * INTEGRALMENTE ORIGINAL - SIN CAMBIOS
 */
export function SeatingChart(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { familias } = useSelector((state) => state.familias);
    const [timer, setTimer] = React.useState(true)
    const { mesasData } = useSelector((state) => state.mesas);

    // Memorizamos el mapeo para que solo se calcule SI cambian las familias
    
    
    useEffect(() => {
        const changeTimer = setInterval(() => {
            setTimer(false)
           const changeTimeout =  setTimeout(() => {
               setTimer(true)
               clearTimeout(changeTimeout)
            }, 14000)
           
        }, 15000)
        return () => clearInterval(changeTimer)
    }, [timer])

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
                                timer={timer}
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
                                timer={timer}
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
                            <Button onClick={() => {
                                dispatch(assignarMesas(familias));
                                let respuesta = globalThis.confirm("¿Estas seguro de guardar los cambios?")
                                if (respuesta) {
                                    navigate("/admin/dashboard");
                                } else {
                                    return 
                                }
                            }}
                            variant='contained'>Guardar cambios</Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant='contained'
                                onClick={async () => {
                                    const fechedFamilies = await invitadosFetch({ dispatch })
                                        renderMesasData({ dispatch, familias: fechedFamilies.payload })
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
};

/**
 * VISTA 2: Asignación Individual
 * Con Draggable optimizado y responsividad atómica corregida
 */
export const TableAssignment = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const mesaId = Number(id);
    const [llena, setllena] = React.useState(false);
    const { sinMesa, mesasData } = useSelector((state) => state.mesas);
    const invitadosEnMesa = useMemo(
        () => mesasData[mesaId] || [],
        [mesasData, mesaId]
    );

    // breakpoint responsivo estricto para móviles
    const isMobile = useMediaQuery('(max-width:768px)');

    // ESCALADO GEOMÉTRICO DINÁMICO: Evita traslapes e imprecisiones de layout en pantallas chicas
    const tableSize = isMobile ? 180 : 450;    // Diámetro de la mesa central blanca
    const radius = isMobile ? 115 : 260;       // Distancia orbital de los invitados al centro
    const guestSize = isMobile ? 50 : 80;      // Tamaño de las burbujas de los invitados

    const onDrop = useCallback(
        (e, destinoMesa) => {
            if (destinoMesa !== 0 && invitadosEnMesa.length === 10) {
                setllena(true);
                setTimeout(() => {
                    setllena(false);
                }, 8000);
            } else {
                e.preventDefault();
                const invId = e.dataTransfer.getData('invitadoId');
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
        [dispatch, invitadosEnMesa.length]
    );

    // Memorizamos el mapeo para que solo se calcule SI cambian las familias
    




    return (
        <Box 
            sx={{ 
                display: 'flex', 
                height: '75vh', 
                overflow: 'hidden',
                flexDirection: isMobile ? 'column-reverse' : 'row' // En celular, el listado baja para no traslaparse con la mesa
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
                    height: `${llena ? 10 : 0}%`,
                    width: '100%',
                    zIndex: 9999,
                    transition: 'all 1s linear',
                }}
            >
                ¡Esta mesa está llena!
            </Alert>
            
            <MesasDrawer onDrop={onDrop} sinMesa={sinMesa} mesaId={mesaId} />

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column', // Apilado vertical para acomodar limpiamente el rótulo arriba
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#f0f0f0',
                    width: isMobile ? '100%' : '65%', // En celular toma todo el ancho ya que el drawer está abajo
                    height: isMobile ? '60vh' : '100%',
                    gap: isMobile ? 2 : 4,
                    p: 2,
                    overflow: 'hidden'
                }}
            >
                

                {/* CONTENEDOR DE LA MESA CIRCULAR */}
                <Box
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, mesaId, 0)}
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
                    <Typography
                        variant={'h2'}
                        sx={{
                            color: '#D4AF37',
                            opacity: 1,
                            zIndex: 10,
                            fontWeight: 'bold',
                        }}
                    >
                        Mesa {id}
                    </Typography>
                    <Typography
                        variant='body2'
                        sx={{ color: 'text.secondary', display: isMobile ? 'none' : 'block' }}
                    >
                        Arrastra aquí
                    </Typography>

                    {invitadosEnMesa.map((inv, index) => {
                        const angle = (index / invitadosEnMesa.length) * (2 * Math.PI);
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                            <Box
                                key={inv.id}
                                draggable
                                onDragStart={(e) =>
                                    e.dataTransfer.setData('invitadoId', inv.id)
                                }
                                sx={{
                                    position: 'absolute',
                                    transform: `translate(${x}px, ${y}px)`,
                                    width: guestSize,
                                    height: guestSize,
                                    borderRadius: '50%',
                                    bgcolor: 'secondary.dark',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    fontSize: isMobile ? '1rem' : '1.75rem', // Tipografía escalada de forma limpia
                                    fontWeight: 'bold',
                                    boxShadow: 4,
                                    cursor: 'grab',
                                    zIndex: 0,
                                    p: 0.5,
                                    border: '2.5px solid white',
                                    wordBreak: 'break-all'
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