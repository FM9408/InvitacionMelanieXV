import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import { ArrowBack as Backspace } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FotoTributo = ({ src, delay }) => (
    <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay }}
        sx={{
            position: 'relative',
            width: "100%",
            aspectRatio: '3/4',
            border: '5px solid',
            borderImageSource: 'linear-gradient(45deg, #8A6D3B, #D4AF37, #F9F6EE, #D4AF37, #8A6D3B)',
            borderImageSlice: 1,
            zIndex:1,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            backgroundColor:  'rgba(0,0,0,0.1)',
            overflow: 'hidden'
        }}
    >
        <Box
            component="img"
            src={src}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.2)' }}
        />
    </Box>
);

const InMemoriam = () => {
    const { datos } = useSelector((state) => state.invitado);
    const theme = useTheme();
    const { images } = useSelector((state) => state.images);
    const user= useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const music = React.useRef(new Audio(images.corazonDeNino))
    
    React.useEffect(() => {
        music.current.loop = true
        music.current.currentTime = 0
        music.current.preload = true
        music.current.pause()
    
        setTimeout(() => {
            music.current.play()
        }, 2000)
        
    },[images, datos, user])
    return (
        <Box sx={{backgroundColor:"#000"}}>
            <Box sx={{ py: 12, color:theme.palette.common.white, textAlign: 'center', width:"100%",  height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundImage: `url(${images.inMemoriam})`, backgroundSize: 'cover', backgroundPosition: 'center', position:"relative" }}>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <IconButton onClick={() => {
                    music.current.pause();
                    music.current.currentTime = 0;
                    navigate(-1)
                }} sx={{ position: "absolute", top: 20, left: 20, color: theme.palette.common.white }} href="/">
                    <Backspace />
                </IconButton>
                {/* --- EFECTO LLAMA DE VELA (Recuperado) --- */}
                <Box
                    component={motion.div}
                    animate={{ 
                        opacity: [0.3, 0.7, 0.3],
                        scaleY: [1, 1.1, 1],
                        filter: ['blur(2px)', 'blur(4px)', 'blur(2px)']
                    }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    sx={{
                        width: '4px',
                        height: '45px',
                        background: 'linear-gradient(to top, #FFD700, #FFA500, transparent)',
                        margin: '0 auto 15px',
                        borderRadius: '50% 50% 20% 20%',
                        boxShadow: '0 0 20px #D4AF37'
                    }}
                />

                <Typography variant="h3" sx={{ fontFamily: "'Cinzel', serif", color: '#D4AF37', position:"absolute", top: 10, left: "50%", transform: "translateX(-50%)", zIndex:1 }}>
                    En honor a quien no pudo acompañarnos
                </Typography>
               

                {/* Grid de Fotos con la Quinceañera */}
                <Box sx={{position:"absolute", bottom: 50, left: "50%", transform: "translateX(-50%)", width:"100%", zIndex:1}}>
                    
                     <Typography variant="h2" sx={{  mb: 2, opacity: 0.9 }}>
                    Gonzalo Medina Rosado
                </Typography>
                <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
                    <Typography variant="h3" sx={{ fontStyle: 'italic', fontSize: '1.3rem', lineHeight: .8, mb:5}}>
                        "Tu amor sigue siendo mi guía, y tu recuerdo el regalo más preciado en este día tan especial."
                    </Typography>
                </Box>
                </Box>
            </motion.div>
        </Box>
        </Box>
    );
};

export default InMemoriam;