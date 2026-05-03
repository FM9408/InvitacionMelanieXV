import { Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import Fuse from 'fuse.js'
import { setInvitationViewed } from '../hooks/database'
import { setInvitado } from '../store/slices/invitationSlice'
import FamilyModal from '../components/FamilyModal/FamilyModal'
import { useSelector, useDispatch } from 'react-redux'

export default function Homepage() {
    const { invitados } = useSelector((state) => state.admin)
    const [invitadosList, setInvitadosList] = React.useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = React.useState(false)
    const [error, setError] = React.useState({
        state: false,
        message: ''
    })
    const onClose = () => {
        setModalOpen(false)
    }

    const searchHandle = async (info) => {
        
        // 1. Creamos una lista plana de todas las familias para que Fuse pueda buscar
        // Añadimos un campo "busquedaGlobal" que concatena todos los nombres de la familia
        const dataset = invitados.map((familia) => ({
            ...familia,
            busquedaGlobal: familia.miembros
                .map((m) => `${m.nombre} ${m.apellido}`)
                .join(' ')
        }))

        // 2. Configuración de Fuse.js (El cerebro de la búsqueda)
        const fuse = new Fuse(dataset, {
            keys: ['busquedaGlobal'],
            threshold: 0.4, // 0.0 es coincidencia perfecta, 1.0 coincide con todo. 0.4 es ideal.
            distance: 100, // Permite que las palabras estén lejos una de otra
            ignoreLocation: true // Busca en cualquier parte del string
        })

        const results = fuse.search(info)
        if (results.length === 1) {
            // Tomamos el primer resultado (el más cercano)
            const familiaEncontrada = results[0].item
            dispatch(setInvitado(familiaEncontrada))
            setInvitationViewed(familiaEncontrada.id)
            navigate(`/user/${familiaEncontrada.id}`)
        } else if (results.length > 1) {
            

            results.forEach(result => {
                setInvitadosList(prev => [...prev, result.item])
            })
            setTimeout(() => {
                setModalOpen(true)
             },100)
            
        } else if (results.length === 0) { 
            navigate('/404')
        }
        else {
            setError({
                state: true,
                message:
                    'No logramos encontrar tu invitación. Revisa la ortografía.'
            })
        }
    }

    function selectedFamily(e) {
        setInvitationViewed(e.id)
       dispatch(setInvitado(e))
        navigate(`/user/${e.id}`)
        onClose()
        setInvitadosList([])
        setError({
            state: false,
            message: ''
        })
    }

    React.useEffect(() => {
        setModalOpen(true)
    }, [])
    return (
        <Container
            sx={{
                width: '100%',
                height: '95vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {invitadosList.length === 0 ? (
                <FamilyModal
                    mode={'Buscar'}
                    open={modalOpen}
                    onError={error}
                    onClose={onClose}
                    key={'none'}
                    onSave={(e) => searchHandle(e)}
                />
            ) : invitadosList.length > 1 ? (
                <FamilyModal
                    mode={'Seleccionar'}
                    open={modalOpen}
                    onError={error}
                    onClose={onClose}
                    key={'none'}
                        invitadosList={invitadosList}
                        setInvitadosList={(e) =>setInvitadosList(e)}
                    onSave={(e) => selectedFamily(e)}
                />) : (
                <Box></Box>
            )
            }
        
        </Container>
    )
}
