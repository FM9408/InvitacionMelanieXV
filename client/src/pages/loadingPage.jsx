import React from 'react';
import { color, motion } from 'framer-motion';
import sraPotsImg from '../assets/images/sraPots.png';
import lumiereImg from '../assets/images/lumiere.png';
import tacitaImg from '../assets/images/tacita.png';
import { Grid, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';


// --- COMPONENTE PRINCIPAL ---
const LoadingPageFlower = () => {
    const theme = useTheme();
    const {images} = useSelector(state => state.images)
    const breakpoints = useMediaQuery(theme.breakpoints.up("sm"))
    const [back, setBack] = React.useState(null)
  
    React.useEffect(() => {
        return  () => setBack(images.dashboardBackground)
    }, [images])

    


    return (
        <SectionWrapper backhround={back}>
            {/* Contenedor relativo que ocupa todo el ancho y oculta lo que sale de los bordes */}
            <Box 
                sx={{ 
                    position: 'relative', 
                    width: '60%', 
                    height: breakpoints ? "80%" :'60%', 
                    display: 'flex', 
                    alignItems: "center",
                    overflow: "hidden",
                  borderRadius:"50%",
                    paddingBottom: '50px',
                   background: ` radial-gradient(circle at center, #D4AF37 10%, #ffffff 100%); `, //
                    boxShadow: 'inset 10px 10px 100px 1px #ffffff'
                   
                   
                }}
            >
                {/* 1. Sra. Potts arranca primero */}
                <SraPots delay={0} breakpoints={breakpoints} />
                
                {/* 2. Las tres mini tacitas le siguen con un retraso escalonado */}
                <MiniTacita delay={.7}breakpoints={breakpoints} />
                <MiniTacita delay={1.4} breakpoints={breakpoints} />
                <MiniTacita delay={2.1} breakpoints={breakpoints}/>
                
                {/* 3. Lumiere aparece al final persiguiéndolas */}
                <Lumiere delay={3} />
            </Box>
            <Box sx={{position:"absolute", bottom:"10%", width:"100%"}}>
                <TextoMecanografiado texto={"Cargando..."} />
                </Box>
            {/* Créditos de las imágenes */}
            <Grid container direction={"column"} sx={{ position: 'absolute', bottom: 20, left: 20 }}>
                <Grid item xs={12}>
                    <Typography variant='caption'>
                        <a href='https://www.vecteezy.com/free-png/tea-cups' target="_blank" rel="noreferrer">
                            Tea Cups PNGs by Vecteezy
                        </a>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='caption'>
                        <a href='https://www.vecteezy.com/free-png/lumiere' target="_blank" rel="noreferrer">
                            Lumiere PNGs by Vecteezy
                        </a>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='caption'>
                        <a href='https://www.vecteezy.com/free-png/tea-pot' target="_blank" rel="noreferrer">
                            Tea Pot PNGs by Vecteezy
                        </a>
                    </Typography>
                </Grid>
            </Grid>
        </SectionWrapper>
    );
};

// --- CONTENEDOR DE LA PÁGINA ---
const SectionWrapper = ({ children, back }) => {
    return (
        <motion.div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                 backgroundImage: `url(${back})`,
                
            }}
        >
            {children}
        </motion.div>
    );
};

// --- VARIABLES DE ANIMACIÓN (KEYFRAMES PARA LOS TUMBOS) ---
// Animación de traslación horizontal y saltos rítmicos
const tumboAnimation = (delayTime) => ({
    x: ['-20vw', '110vw'], // Va desde fuera de la pantalla izquierda hasta fuera por la derecha
    y: ["0", "-10%", "0", "-15%", "0", "-5%", "0", "-1%", "0", "-2%", "0", "-10%", "0", "-20", "0"], // Sube y baja (efecto rebote)
    rotateZ: [0, 5, -10, 5, -2.5, 10, -5, 10, -5, 10, -5, 10, -5, 10, 0] , // Pequeño bamboleo al avanzar}
    rotateX: [0, 5, -10, 5, -2.5, 10, -5, 10, -5, 10, -5, 10, -5, 10, 0],
    display: ["none", "block", "none"],
    transition: {
        duration: 3,        // Tiempo que tarda en cruzar toda la pantalla
        delay: delayTime,    // Momento en el que empieza a moverse
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: 2// Se repite en bucle para la página de carga
    }
});

// --- COMPONENTES DE LOS PERSONAJES ---

// Sra. Potts (Tetera Grande)
const SraPots = React.memo(({ delay, breakpoints }) => {
    
   
    return (
        <motion.div
            animate={tumboAnimation(delay)}
            style={{ position: 'absolute', left: 0, }}
        >
            <img 
                src={sraPotsImg} 
                alt="Sra. Pots" 
                style={{ width:breakpoints ? "100%" : "60%", height: 'auto', display: 'block', transform:'rotateY(180deg)' }} 
            />
        </motion.div>
    );
});

// Mini Tacitas (Se renderizan 3 veces con diferentes delays)
const MiniTacita = React.memo(({ delay, breakpoints }) => {
    return (
        <motion.div
            animate={tumboAnimation(delay)}
            style={{ position: 'absolute', left: 0, transform:'rotateY(180deg)' }}
        >
            <img 
                src={tacitaImg} 
                alt="Mini Tacita" 
                style={{  width:breakpoints ? "100%" : "60%", height: 'auto', display: 'block' }} 
            />
        </motion.div>
    );
});

// Lumiere (La Vela)
const Lumiere = React.memo(({ delay, breakpoints }) => {
    return (
        <motion.div
            animate={tumboAnimation(delay)}
            style={{
                position: 'absolute', left: -50, transform: 'rotateY(180deg) scaleX(75%) scaleZ(110%)'
            }}
        >
            <img 
                src={lumiereImg} 
                alt="Lumiere" 
                style={{ width:breakpoints ? "100%" : "60%", height: '60%', display: 'block' }} 
            />
        </motion.div>
    );
});





const TextoMecanografiado = ({ texto}) => {
    const letras = Array.from(texto);

    // Animación de escritura inicial para las letras (solo ocurre una vez al cargar)
    const letraVariantes = {
        hidden: { opacity: 0 },
        visible: (i) => ({
            opacity: 1,
            transition: {
                delay: i * 0.4, // Ritmo de escritura inicial
            },
        }),
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, alignItems:"flex-end", width:"100%" }}>
            {/* Este contenedor envuelve todo el texto y lo hace parpadear suavemente 
              de forma infinita una vez que ya se ha escrito.
            */}
            <motion.div
                animate={{
                    opacity: [0, 1, 1, 1], // Se queda visible, luego desaparece y vuelve a aparecer
                }}
                transition={{
                    duration: 5,           // Duración total de cada ciclo del bucle
                    times: [0, 0.7, 0.85, 1], // Controla el ritmo: 70% del tiempo visible, baja a 0 rápido, vuelve a 1
                    repeat: Infinity,
                    repeatType: "loop",// Bucle infinito,
                    ease: "easeInOut",
                }}
                style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif',
                    color: '#5c4033',
                    letterSpacing: '2px'
                }}
            >
                {letras.map((letra, index) => (
                    <motion.span
                        key={index}
                        custom={index} // Pasa el índice para el retraso individual
                        variants={letraVariantes}
                        style={{fontFamily:"Tangerine Regular", fontSize:`${100/texto.length}ch`}}
                        initial="hidden"
                        animate="visible"
                    >
                        {letra === " " ? "\u00A0" : letra}
                    </motion.span>
                ))}
            </motion.div>
        </Box>
    );
};
export default LoadingPageFlower;