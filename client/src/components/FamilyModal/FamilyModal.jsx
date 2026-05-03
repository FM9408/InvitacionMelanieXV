import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Typography,
    Box,
    useTheme,
    Container
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    Add,
    Delete,
    Save,
    Send,
    CheckCircle,
    Cancel,
    PersonSearch
} from '@mui/icons-material'
import { bool, string, object, func } from "prop-types"
import { setConfirmation } from '../../hooks/database';
import { useDispatch } from 'react-redux';
import { fetchInvitados } from '../../store/slices/adminSlice';
import RoseDevider from '../Decorations/roseDivider';






const FamilyModal = ({ open, onClose, mode, initialData, onSave, onError, invitadosList, setHasOpened }) => {
    const { datos } = useSelector((state) => state.invitado);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [willAssist, setWillAssist] = useState([]);
    const [wontAssist, setWontAssist] = useState([])
    const [search, setSearch] = useState('')
    const theme = useTheme()
    const [familyData, setFamilyData] = useState({
        nombreFamilia: '',
        invitados: [{ nombre: '' }]
        //mensaje: ''
    })

    // Resetear o cargar datos al abrir
    useEffect(() => {
        if (mode === "Confirmar" && datos.miembros.length === 0) {
           navigate("/")
        }
        if (mode === "Editar") {
            setFamilyData({
                nombreFamilia: initialData.apellido,
                invitados: initialData.miembros
            })
        }
        
        
    }, [initialData, open])

    // Manejadores para el modo Registro
    const addMember = () => {
        setFamilyData({
            ...familyData,
            invitados: [...familyData.invitados, { nombre: '' }]
        })
    }
   
    const assistHandler = (miembro) => {
        
        setWontAssist(wontAssist.filter((member) => member !== miembro.id))
        const arrayHandler = willAssist.filter((member) => member === miembro.id)
        setWillAssist(arrayHandler)
        setWillAssist([...willAssist, miembro.id])
    }

    const dontAssistHandler = (miembro) => {
       
        setWillAssist(willAssist.filter((member) => member !== miembro.id))
        const arrayHandler = wontAssist.filter((member) => member === miembro.id)
        setWontAssist(arrayHandler)
        setWontAssist([...wontAssist, miembro.id])

    }
    function confirmationHandler() {
        setConfirmation(willAssist, wontAssist)
        dispatch(fetchInvitados())
        onClose()
    }

    const updateMember = (index, value) => {
        const newMembers = [...familyData.invitados]
        newMembers[index].nombre = value
        setFamilyData({ ...familyData, invitados: newMembers })
    }
    const setDisablehandler = () => {
        const bool = datos.miembros.length === willAssist.length + wontAssist.length
       
        return !bool
    }
    const removeMember = (index) => {
        const newMembers = familyData.invitados.filter((_, i) => i !== index)
        setFamilyData({ ...familyData, invitados: newMembers })
    }

    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>
                {mode === 'Añadir' && 'Registrar Nueva Familia'}
                {mode === "Editar" && 
                    <Container sx={{mb:-5, width:"100%", textAlign:"center"}}>
                         <Typography
                                variant='SearchFont'
                                gutterBottom
                                sx={{
                                    textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                    color: `${theme.palette.primary.main}`
                                    
                                }}
                            >
                                Editar Familia
                            </Typography>
                    </Container>
                }
                {mode === 'Confirmar' && 
                    <Container sx={{mb:-5, width:"100%", textAlign:"center"}}>
                         <Typography
                                variant='SearchFont'
                                gutterBottom
                                sx={{
                                    textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                    color: `${theme.palette.primary.main}`
                                    
                                }}
                            >
                                ¿Quienes nos acompañarán?
                            </Typography>
                    </Container>
                }
                {
                    mode === "Seleccionar" && 
                    <Container sx={{mb:-5, textAlign:"center",  width:"100%"}}>
                         <Typography
                                variant='SearchFont'
                                gutterBottom
                                sx={{
                                    textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                    color: `${theme.palette.primary.main}`
                                    
                                }}
                            >
                               Confirma tus apellidos
                            </Typography>
                    </Container>
                }
                {mode === 'Buscar' && 
                    <Container sx={{mb:-5}}>
                         <Typography
                                variant='SearchFont'
                                gutterBottom
                                sx={{
                                    textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                    color: `${theme.palette.primary.main}`
                                    
                                }}
                            >
                                Por favor introduce tu apellido o tu nombre
                            </Typography>
                    </Container>
                }
                {mode === 'Mensaje' && 'Enviar Dedicatoria'}
            </DialogTitle>
            <RoseDevider />
            <DialogContent >
                {/* MODO REGISTRO: Apellido y lista de miembros */}
                {mode === 'Añadir' && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 1
                        }}
                    >
                        <TextField
                            label='Apellido de la Familia'
                            fullWidth
                            value={familyData.nombreFamilia}
                            onChange={(e) =>
                                setFamilyData({
                                    ...familyData,
                                    nombreFamilia: e.target.value
                                })
                            }
                        />
                        <Typography variant='subtitle2'>
                            Miembros de la familia:
                        </Typography>
                        {familyData.invitados.map((inv, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    label={`Integrante ${index + 1}`}
                                    fullWidth
                                    size='small'
                                    value={inv.nombre}
                                    onChange={(e) =>
                                        updateMember(index, e.target.value)
                                    }
                                />
                                <IconButton
                                    onClick={() => removeMember(index)}
                                    color='error'
                                    disabled={familyData.invitados.length === 1}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<Add />}
                            onClick={addMember}
                            variant='outlined'
                        >
                            Agregar Miembro
                        </Button>
                    </Box>
                )}

                {/* MODO CONFIRMACIÓN: Checkbox o botones para cada uno */}
                {mode === 'Confirmar' && (
                    <Box>
                        <Typography variant='h6' gutterBottom>
                            {familyData.nombreFamilia}
                        </Typography>
                        {datos.miembros.map((inv) => (
                            <Box
                                key={inv.id}
                                sx={{
                                    display: 'flex',
                                    width:`${100}%`,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Typography  sx={{width: `${100/3}%`}} variant="invitadoName">{inv.nombre}</Typography>
                               
                                    <Button
                                        color='success'
                                        startIcon={<CheckCircle />}
                                    variant={willAssist.includes(inv.id) ? 'contained' : "text"}
                                    
                                        onClick={() => {
                                            assistHandler(inv)
                                        }}
                                        sx={{width: `${100/3}%`, pointerEvents: willAssist.includes(inv.id) ? "none" : "auto"}}
                                    >
                                        Asiste
                                    </Button>
                                    <Button
                                        variant={wontAssist.includes(inv.id) ? 'contained' : "text"}
                                        onClick={() => {
                                            dontAssistHandler(inv)
                                        }}
                                        sx={{width: `${100/3}%`, pointerEvents: wontAssist.includes(inv.id) ? "none" : "auto"}}
                                        color='error'
                                        startIcon={<Cancel />}
                                    >
                                        No asiste
                                    </Button>
                                </Box>
                            
                        ))}
                    </Box>
                )}

                {/* MODO MENSAJE: Textarea para dedicatoria */}
                {mode === 'Mensaje' && (
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            label='Tu mensaje para los festejados'
                            multiline
                            rows={4}
                            fullWidth
                            value={familyData.mensaje}
                            onChange={(e) =>
                                setFamilyData({
                                    ...familyData,
                                    mensaje: e.target.value
                                })
                            }
                        />
                    </Box>
                )}
                {mode === 'Buscar' && (
                  
                       
                        <Box sx={{mt:-2}}>
                            <TextField
                                rows={1}
                                fullWidth
                                value={search}
                                helperText={onError.state ? onError.message : ''}
                                error={onError.state}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Box>
                    
                )}
                {
                    mode === 'Seleccionar' && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {
                                invitadosList.map((familia) => {
                                    return (
                                        <Box
                                            key={familia.id}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2
                                            }}
                                        >
                                            <Typography variant="invitadoName">{familia.apellido}</Typography>
                                            <Box>
                                                <Button
                                                    color='success'
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => onSave(familia)}
                                                >
                                                    Seleccionar
                                                </Button>
                                            </Box>
                                        </Box>
                                    )
                                })
                                }
                            
                        </Box>)
                }
                {
                    mode === "Editar" && (
                        <Box>
                            <TextField
                                label='Apellido de la Familia'
                                fullWidth
                                value={familyData.nombreFamilia}
                                onChange={(e) =>
                                    setFamilyData({
                                        ...familyData,
                                        nombreFamilia: e.target.value
                                    })
                                }
                            />{
                                familyData.invitados.map((inv,i) => (
                                    <Box
                                        key={inv.id}
                                        sx={{
                                            display: 'flex',
                                        }}
                                    >
                                        <TextField label={`Integrante ${i + 1}`} fullWidth size='small' value={inv.nombre} onChange={(e) => updateMember(inv.id, e.target.value)} sx={{my:1}} />
                                        
                                        </Box>
                                ))       
                            }
                        <Button onClick={() => addMember()}>
                            Agregar Miembro
                        </Button>
                        </Box>

                    )
                }
            </DialogContent>

            <DialogActions>
                {mode === 'Añadir' || mode === 'Editar' && (
                    <Button onClick={onClose}>Cancelar</Button>
                )}
                {
                    mode === "Confirmar" && (
                        <IconButton onClick={() => {
                            onClose()
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                            
                            setHasOpened(false)
                        }}
                           
                           
                        >
                            <RestartAltIcon />
                        </IconButton>
                    )
                }
                {
                    mode === "Confirmar" ? 
                        <Button
                            variant='contained'
                            sx={{width:"80%"}}
                            disabled={setDisablehandler()}
                            onClick={() => {
                                confirmationHandler()
                                onClose()
                            }}
                        >
                            Enviar confirmación
                        </Button>
                        : <Box>
                             {
                    mode !== "Seleccionar" && <Button
                    disabled={search.length === 0 && mode === 'Buscar'}
                    variant='contained'
                    startIcon={
                        mode === 'Mensaje' ? (
                            <Send />
                        ) : mode === 'Buscar' ? (
                            <PersonSearch />
                        ) : (
                            <Save />
                        )
                    }
                    onClick={() => {
                        if (mode === "Buscar") {
                            onSave(search)
                           
                                onClose()
                            
                        } else if (mode === "Confirmar") {
                            confirmationHandler()
                            onClose()
                        }
                        else {
                            
                                setFamilyData({
                                    nombreFamilia: '',
                                    invitados: [{ nombre: '' }]
                                }),
                                onSave(familyData),
                                onClose()
                        }
                    }}
                    sx={{ width: '100%' }}
                >
                    {mode === 'Añadir'
                        ? 'Guardar Familia'
                        : mode === 'Buscar'
                          ? 'Buscar'
                          :  'Enviar'}
                </Button>
                }
                        </Box>
               }
            </DialogActions>
        </Dialog>
    )
}

export default FamilyModal

FamilyModal.propTypes = {
    open: bool.isRequired,
    onClose: func.isRequired,
    mode: string.isRequired,
    initialData: object,
    onSave: func.isRequired,
    onError: func.isRequired,
    invitadosList: object,
    
}


