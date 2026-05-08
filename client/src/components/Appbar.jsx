import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useTheme, Grid } from '@mui/material';
import {Restaurant, Dashboard } from '@mui/icons-material'
import { useNavigate, matchPath } from 'react-router-dom';
import {motion, animate } from "framer-motion"



const ButtonAnimation = ({ children }) => {
    const [timer, setTimer] = React.useState(2000)
    

   const colors = {
    champagne: "#D4AF37",
    ivory: "#F9F6EE",
    deepGold: "#B28D42"
  };
    
    React.useEffect(() => {
        const timerInterval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 100)
            } else {
                clearInterval(timerInterval)
            }
        },100)
       
    }, [timer])

    return (
        <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
    >
      <motion.div
        animate={{
          // Movimiento lateral suave (tipo péndulo)
                    x: [-10, 60, 60], 
            rotateZ:[0,30,45],
          
          // Transición de color elegante
          color: [colors.ivory, colors.champagne, colors.deepGold],
          
          // Filtro de resplandor que pulsa suavemente
          filter: [
            `drop-shadow(0px 0px 8px ${colors.deepGold}60)`,
            `drop-shadow(0px 0px 20px ${colors.champagne}80)`,
            `drop-shadow(0px 0px 8px ${colors.deepGold}60)`,
          ],
        }}
        transition={{
            duration: 6,
          delay:1,  // Más lento para que sea elegante
          ease: "easeInOut", // Suaviza el inicio y el fin del movimiento
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 5000,
        }}
        style={{
          fontSize: 70,
          display: 'flex',
          cursor: 'pointer'
        }}
      >
        {children}
      </motion.div>
    </Box>
    )
}

const buttonsArray = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: <Dashboard sx={{ fontSize: "1.5rem", mr:-2 }}/>,
    },
    {
        name: 'Mesas',
        href: '/admin/mesas',
        icon: <Restaurant sx={{ fontSize: "1.5rem", mr:-2 }}/>,
    },
];

const AppBarButtons = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = globalThis.location.pathname.toString().split('/')[2]
    const [isLocation, setIsLocation] = React.useState(false)

    React.useEffect(() => { 
        setIsLocation(location)
        console.log(isLocation)
    },[isLocation, location])
        

    return (
        <Grid container gap={1}>
            {buttonsArray.map((button) => {
                return (
                    <Grid item key={button.name} sx={{ display: 'flex', alignItems: 'center',flexDirection:"row", gap: 1}}>
                        <Grid item sx={{ display: 'flex', alignItems: 'center', }}>
                            {
                                isLocation === button.name.toLocaleLowerCase() ? (
                                    <ButtonAnimation>
                                        {button.icon}
                                    </ButtonAnimation>
                                ) : (
                                         button.icon 
                                )
                            }
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center', }}>
                            <Button
                        key={button.name}
                        onClick={() => navigate(button.href)}
                        variant='text'
                        color={theme.palette.secondary.main}
                    >
                        {button.name}
                    </Button>
                        </Grid>

                    </Grid>
                );
            })}
        </Grid>
    );
};

export default function Appbar() {
    return (
        <AppBar variant='admin'>
            <Toolbar>
                
                <AppBarButtons />
                
            </Toolbar>
        </AppBar>
    );
}
