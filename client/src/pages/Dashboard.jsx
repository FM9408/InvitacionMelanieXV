
import React from 'react'
import { Grid, Paper, Typography, Box, IconButton, useTheme } from '@mui/material'
import GuestListModule from '../modules/GuestList/GuestListModule'
import { NotregulableLoadingCircle} from "../components/Decorations/LoadingCircle"
import AnalyticsModule from '../modules/Analytics/AnalyticsModule'
import PeopleIcon from '@mui/icons-material/People'
import { GuestManagement } from '../modules/Admin/GuestMAnagement'
import { useSelector} from 'react-redux'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmailIcon from '@mui/icons-material/Email'
import StatCard from '../components/StatCard'
import MessagesModule from '../modules/Messages/MessagesModule'
import { LoadingCircle } from '../components/Decorations/LoadingCircle'
import RoseDevider from '../components/Decorations/roseDivider';

const Dashboard = () => {
    const theme = useTheme()
    const { invitados } = useSelector((state) => state.admin)
    const {mensajes} = useSelector((state) => state.mensajes)
    const [loadingData, setLoadingData] = React.useState(true)
    const [totalConfirmados, setTotalConfirmados] = React.useState(0)
    const [totalGuests, setTotalGuests] = React.useState(0)


    
    
    
    React.useEffect(() => {
        function countByStatus() {
            let confirmed = 0  
            invitados.forEach((familia) => {
                familia.miembros.forEach((miembro) => {
                    if (miembro.willAssist === "Confirmado") {
                        confirmed++
                    }
                })
            })
            return confirmed
        }
        function getTotalGuests() {
            let total = 0
            invitados.forEach((familia) => { 
                familia.miembros.forEach(() => {
                    total ++
                })
            })
            return total
        } 
        setTotalConfirmados(countByStatus())
            setTotalGuests(getTotalGuests())
      
                setTimeout(() => {
                   
                    setLoadingData(false)
                

                }, 5000)
            
            
        
    }, [loadingData])

    
    return (
        <Box sx={{width:"100%" }}>
            <Grid container sx={{ width: "100%", display: 'flex', flexDirection: { md: 'column' } }}>
                {' '}
                {/* STATS: En móvil (xs) ocupan 12 espacios (todo el ancho) */}
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' }
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={12}
                        sx={{
                            display: { xs: 'block', md: 'inline-flex' },
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            width: { xs: '100%', md: `${100 / 2}%` },
                            height: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <Grid
                            
                            item

                            sx={{
                                 display: "flex", 
                                flexDirection: { xs: 'column', md: 'row' },
                                width: { xs: '100%', md: `${100 / 3}%` },
                                mr: { xs: 0, md: 1 },
                                mt: { xs: 1, md: 0 },
                                height: 'fit-content',
                                alignItems: 'center'
                            }}
                        >
                            {
                                loadingData ? (
                                    <NotregulableLoadingCircle />

                                ):( <StatCard
                                title='Total'
                                value={totalGuests}
                                icon={PeopleIcon}
                            />)
                           }
                        </Grid>
                        <Grid
                            item

                            sx={{
                                 display: "flex", 
                                flexDirection: { xs: 'column', md: 'row' },
                                width: { xs: '100%', md: `${100 / 3}%` },
                                mr: { xs: 0, md: 1 },
                                mt: { xs: 1, md: 0 },
                                height: 'fit-content',
                                alignItems: 'center'
                            }}
                        >
                            {
                                loadingData ? (
                                    <NotregulableLoadingCircle />

                                ):<StatCard
                                title='Confirmados'
                                value={`${totalConfirmados}/${totalGuests}`}
                                icon={CheckCircleIcon}
                            />
                            }
                        </Grid>
                        <Grid
                            item
                            sx={{
                                display: "flex", 
                                flexDirection: { xs: 'column', md: 'row' },
                                width: { xs: '100%', md: `${100 / 3}%` },
                                mr: { xs: 0, md: 1 },
                                mt: { xs: 1, md: 0 },
                                height: 'fit-content',
                                alignItems: 'center'
                            }}
                        >
                            {
                           loadingData ? (
                                    
                                        <NotregulableLoadingCircle />
                                    

                                ): (<StatCard
                                title='Mensajes'
                                value={mensajes.length}
                                icon={EmailIcon}
                                />)
                                }
                        </Grid>
                    </Grid>
                    {/* ANALYTICS: Siempre ancho completo */}
                    <Grid
                        item
                        sx={{
                            display: 'inline',
                            width: { xs: '100%', md: `${100 / 2}%` },
                            mt: 1
                        }}
                    >
                        <Paper>
                            <AnalyticsModule />
                        </Paper>
                    </Grid>
                </Grid>
                {/* GUEST LIST: 12 en móvil, 8 en desktop */}
                {/* <Grid  >
        <Paper >
          <GuestListModule />
        </Paper>
      </Grid> */}
                {/* MESSAGES: 12 en móvil, 4 en desktop */}
                <Grid item xs={12} md={8} sx={{ width: "100%", display: { lg: "flex" }, justifyContent:"center"}}>
                    <Paper sx={{ p: 2, minHeight: '400px', m:1, width:"100%",   borderTop: `6px solid ${theme.palette.primary.main}`,}}>
                        <Typography variant='adminH6' gutterBottom>
                            Mensajes de Invitados
                        </Typography>
                        <RoseDevider />
                        <MessagesModule />
                    </Paper>
                </Grid>
                {/* 2. Lista de Invitados (Izquierda) */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, minHeight: '400px', minWidth:"450px", position:"relative", m:1,  borderTop: `6px solid ${theme.palette.primary.main}` }}>
                        <Typography
                            variant='adminH6'
                            sx={{
                                display: 'inline-flex',
                                width: '80%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            gutterBottom
                        >
                            Lista de Invitados
                        </Typography>
                        <Box sx={{position:"absolute", right:"10%", top:"2%"}}>
                               <GuestManagement mode='Añadir' totalGuests={totalGuests} />
                        </Box>
                        <RoseDevider />
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20%'
                            }}
                        >
                        </Box>
                        <GuestListModule />
                    </Paper>
                </Grid>
                {/* 3. Mensajes Recibidos (Derecha) */}
                {/* <Grid item  xs={12} md={8}  >
        <Paper >
          <Typography variant="h6" gutterBottom>Mensajes de Invitados</Typography>
          <MessagesModule />
        </Paper>
      </Grid> */}
            </Grid>
        </Box>
    )
}

export default Dashboard
