import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Grid, useTheme } from '@mui/material';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Video } from '@videojs/react/video';
import { useNavigate } from 'react-router-dom';
import { BackgroundVideoSkin, BackgroundVideo } from '@videojs/react/background';
import FamilyModal from '../FamilyModal/FamilyModal';
import PropTypes from 'prop-types';
import YardIcon from '@mui/icons-material/Yard';
import { Player } from '../../main';
import { useSelector } from 'react-redux';


// Importa este icono o tu SVG de rosa
const frasesArray = [
    '¿Te lo vas a perder?',
    '¿Cómo podrías faltar?',
    '¡Será inolvidable!',
    '¡No puedes faltar!',
    '¡Será un día mágico!',
    '¡No te lo puedes perder!',
    '¡Será una celebración épica!',
    '¡Será un día para recordar!',
    '¡No puedes faltar a esta fiesta!',
    '¡Será un evento único!',
];
const introduccionFrases = [
    'el mundo se iluminó con tu llegada...',
    'el universo celebró tu existencia...',
    'una estrella nació para brillar...',
    'la alegría se multiplicó con tu llegada...',
    'el amor se hizo más grande con tu nacimiento...',
    'el tiempo se detuvo para celebrar tu llegada...',
    'la magia se hizo realidad con tu nacimiento...',
    'el destino sonrió con tu llegada...',
    'la felicidad se desbordó con tu nacimiento...',
    'el mundo se volvió un lugar mejor con tu llegada...',
];
const MarcoDorado = ({ imagen }) => (
    <Box
        sx={{
            position: 'relative',
            width: { xs: '260px', md: '350px' },
            height: { xs: '350px', md: '490px' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            // 1. EL MARCO (Efecto Oro Tallado)
            border: '20px solid',
            borderImageSource:
                'linear-gradient(45deg, #8A6D3B, #D4AF37, #F9F6EE, #D4AF37, #8A6D3B)',
            borderImageSlice: 1,

            // Fondo de la foto
            backgroundImage: `url(${imagen})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow:
                '0 40px 80px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,0,0,0.6)',

            // 2. EL COPETE SUPERIOR (Adorno Barroco Central)
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '-35px',
                width: '140px',
                height: '60px',
                // Usamos un clip-path para crear una forma ornamental sin depender de imágenes externas
                backgroundColor: '#D4AF37',
                clipPath:
                    'polygon(50% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                backgroundImage: 'linear-gradient(to bottom, #F9F6EE, #B28D42)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                zIndex: 2,
            },

            // 3. LAS "ESQUINAS" DE ORO (Detalle de filigrana)
            '&::after': {
                content: '""',
                position: 'absolute',
                inset: '-10px', // Sobresale un poco del marco
                border: '2px solid #F9F6EE',
                opacity: 0.4,
                pointerEvents: 'none',
                borderRadius: '2px',
            },
        }}
    >
        {/* Adorno extra: Esquinas internas tipo "L" */}
        {[
            { t: 0, l: 0 },
            { t: 0, r: 0 },
            { b: 0, l: 0 },
            { b: 0, r: 0 },
        ].map((pos, i) => (
            <Box
                key={i}
                sx={{
                    position: 'absolute',
                    width: `100%`, // Esquinas más pequeñas hacia el centro
                    height: '100%',
                    border: '3px solid #F9F6EE',
                    zIndex: 3,
                    ...pos,
                    borderColor:
                        i < 2 ?
                            '#F9F6EE transparent transparent #F9F6EE'
                        :   '#F9F6EE', // Esto es simplificado
                    // En un entorno real usarías un SVG de esquina barroca aquí
                }}
            />
        ))}
    </Box>
);

MarcoDorado.propTypes = {
    imagen: PropTypes.string,
};

export const InvitacionNarrativa = () => {
    const { images } = useSelector((state) => state.images);
    const theme = useTheme();
    const mainAudio = useRef(
        new Audio(images.afterTheMascarade)
    );
   
    const [frase, setFrase] = useState('');
    const navigate = useNavigate();
    const [introduccionFrase, setIntroduccionFrase] = useState('');
    let volume = useRef(0);
    const containerRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    // Configuración de velocidad (ajústalo a tu gusto)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const leftPhotoRotateY = useTransform(
        scrollYProgress,
        [0.2, 0.35],
        [0, 30]
    );
    const rightPhotoRotateY = useTransform(
        scrollYProgress,
        [0.2, 0.35],
        [0, -30]
    );

    const startAudio = () => {
        mainAudio.current.currentTime = 0;
       
        setTimeout(() => {
            mainAudio.current.play();
        }, 2000);
        const volumeInterval = setInterval(() => {
            if (volume.current < 1) {
                volume.current = Math.min(volume.current + 0.01, 1);
                mainAudio.current.volume = volume.current;
            } else {
                clearInterval(volumeInterval);
            }
        }, 700);
        globalThis.removeEventListener('click', startAudio);
        globalThis.addEventListener('stop', stopMusic);
    };
    const stopMusic = () => {
        const volumeInterval = setInterval(() => {
            if (volume.current >= 0) {
                volume.current = Math.max(volume.current - 0.01, 0);
                //--
                mainAudio.current.volume = volume.current;
            } else {
                clearInterval(volumeInterval);
                setTimeout(() => {
                    mainAudio.current.pause();
                    mainAudio.current.currentTime = 0;
                }, 200);
                globalThis.removeEventListener('stop', stopMusic);
            }
        }, 700);
        globalThis.removeEventListener('start', startAudio);
    };
    const photosRotateX = useTransform(scrollYProgress, [0, 0.35], [85, 20]);
    const photosZ = useTransform(scrollYProgress, [0.2, 0.35], [-400, 0]);
    const leftPhotoX = useTransform(scrollYProgress, [0.2, 0.35], [0, -100]);
    const rightPhotoX = useTransform(scrollYProgress, [0.2, 0.35], [0, 100]);

    // Abrir modal al final
    useEffect(() => {
        mainAudio.current.loop = false;
      mainAudio.current.pause()
        globalThis.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        let requestID;
        const totalDurationMS = 50000; // 60 segundos

        const startTime = performance.now();
        if (
            modalOpen === false &&
            globalThis.location.pathname.split('/')[1] === 'user' &&
            !globalThis.location.pathname.split('/')[3]
        ) {
            dispatchEvent(new Event('start'));
        } else {
            mainAudio.current.pause();
            dispatchEvent(new Event('stop'));
        }
        globalThis.addEventListener('restartInvitation', startAudio);
        const autoScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const totalScrollable =
                document.body.scrollHeight - window.innerHeight;
            const progress = Math.min(elapsedTime / totalDurationMS, 1);

            window.scrollTo(0, totalScrollable * progress);

            // FINAL DE LA ANIMACIÓN: Abrir modal forzosamente
            if (progress >= 1) {
                const user = globalThis.localStorage.getItem('user');
                const viewed = JSON.parse(user);
               
                
                if (viewed.hasViewed === true) {
                    navigate(`/user/${viewed.id}/dashboard`)
                }
                if (!hasOpened) {
                    setModalOpen(true);
                    setHasOpened(true);
                }
                cancelAnimationFrame(requestID);
            } else if (!modalOpen) {
                requestID = requestAnimationFrame(autoScroll);
            }
        };

        const timer = setTimeout(() => {
            requestID = requestAnimationFrame(autoScroll);
        }, 1000);

        return () => {
            setFrase(
                frasesArray[Math.floor(Math.random() * frasesArray.length)]
            );
            setIntroduccionFrase(
                introduccionFrases[
                    Math.floor(Math.random() * introduccionFrases.length)
                ]
            );
            globalThis.addEventListener('start', startAudio);
            cancelAnimationFrame(requestID);
            globalThis.removeEventListener('click', startAudio);
            clearTimeout(timer);
        };
    }, [modalOpen, hasOpened]);

    // --- RANGOS DE VISIBILIDAD (Sin solapamiento) ---

    return (
        <Box
            ref={containerRef}
            sx={{ height: '1100vh', backgroundColor: '#000' }}
        >
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                {/* 1. INTRO */}
                {/* SECCIÓN 1: INTRO (Igual) */}
                <SectionWrapper progress={scrollYProgress} range={[0, 0.2]}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            backgroundImage: `url(${images.roseBack1})`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                        }}
                    >
                        <Grid
                            container
                            justifyContent='center'
                            alignItems='center'
                            spacing={2}
                            direction='column'
                        >
                            <Grid item>
                                <TypografyItem
                                    progress={scrollYProgress}
                                    range={[0.02, 0.1]}
                                    text='Hace 15 años,'
                                />
                            </Grid>
                            <Grid item>
                                <TypografyItem
                                    progress={scrollYProgress}
                                    range={[0.02, 0.2]}
                                    text={introduccionFrase}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </SectionWrapper>

                {/* 2. FOTOS (EFECTO MARCO SOBRE MESA) */}
                <SectionWrapper progress={scrollYProgress} range={[0.2, 0.35]}>
                    <Box
                        sx={{
                            perspective: '1500px',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            backgroundImage: `url(${images.gardenOfRoses})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0,
                        }}
                    >
                        {/* MARCO IZQUIERDO */}
                        <Box
                            component={motion.div}
                            style={{
                                x: leftPhotoX,
                                z: photosZ,
                                rotateX: photosRotateX,
                                rotateY: leftPhotoRotateY,
                                transformStyle: 'preserve-3d',
                            }}
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                marginLeft: { xs: '-130px', md: '-175px' },
                                marginTop: { xs: '-175px', md: '-245px' },
                            }}
                        >
                            <MarcoDorado imagen={images.urlMela1} />
                        </Box>

                        {/* MARCO DERECHO */}
                        <Box
                            component={motion.div}
                            style={{
                                x: rightPhotoX,
                                z: photosZ,
                                rotateX: photosRotateX,
                                rotateY: rightPhotoRotateY,
                                transformStyle: 'preserve-3d',
                            }}
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                marginLeft: { xs: '-130px', md: '-175px' },
                                marginTop: { xs: '-175px', md: '-245px' },
                            }}
                        >
                            <MarcoDorado imagen={images.urlMela2} />
                        </Box>
                    </Box>
                </SectionWrapper>
                {/*3. Texto "Ahora..." */}
                <SectionWrapper progress={scrollYProgress} range={[0.43, 0.5]}>
                    <Player.Container>
                        <Box
                            sx={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                           
                            <BackgroundVideoSkin> 
                                <BackgroundVideo onEnded={(e) => e.currentTarget.pause()} onLoad={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.playsInline = true;
                                    e.currentTarget.currentTime = 0;
                                    e.currentTarget.play();
                                }} src={images.roseVideo} muted style={{width:"100%"}} />
                           </BackgroundVideoSkin>
                           
                           

                        </Box>
                    </Player.Container>
                </SectionWrapper>
                <SectionWrapper progress={scrollYProgress} range={[0.48, 0.53]}>
                     <Box   sx={{ position: "absolute", top:"30%" }}>
                                  <TypografyItem
                                progress={scrollYProgress}
                                range={[0.45, 0.53]}
                                text='Ahora...'
                            />
                            </Box>
                </SectionWrapper>

                {/* 4. CELEBRACIÓN */}
                <SectionWrapper progress={scrollYProgress} range={[0.53, 0.8]}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundImage: `url(${images.background})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0,
                        }}
                    >
                                
    
                        {/* --- CLAVE 1: Superposición para contraste --- */}
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)', // Oscurece el fondo un 60%
                                zIndex: 1,
                            }}
                        />
                                
                        <Box sx={{ zIndex: 1, position: 'absolute', opacity: "100%", top: "10%", right: "10%", width: "100%", height: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Typography variant="invitationFont" sx={{   // Asegúrate de tenerla cargada en el index.html o Webfont
                                        color: '#D4AF37', // Dorado para el título
                                        mb: 8, // Más espacio debajo del título
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        textShadow: '0 4px 8px rgba(0,0,0,0.8)', 
                                    }}>
                                    Luz Melany
                                </Typography>
                        </Box>
                        {/* Contenedor de la Imagen de Melanie (izquierda) */}
                        <Box
                            sx={{
                                width: '50%',
                                height: '80%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 2, // Por encima del overlay
                            }}
                        >
                            <MelanieImage
                                image={images.urlMelanieWRose}
                                progress={scrollYProgress}
                                range={[0.53, 0.63, 0.73, 0.83]}
                            />
                        </Box>

                        {/* Contenedor del Texto (derecha) */}
                        <Box sx={{ flex: 1, pr: { md: 10 }, zIndex: 2 }}>
                            {' '}
                            {/* flex: 1 para ocupar espacio restante */}

                            <Typography
                                variant='InvitationSecondaryText'
                                sx={{
                                    fontFamily: 'Cinzel', // Asegúrate de tenerla cargada en el index.html o Webfont
                                    color: '#D4AF37', // Dorado para el título
                                    mb: 8, // Más espacio debajo del título
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.8)',
                                }}
                            >
                                ESTAMOS CELEBRANDO:
                            </Typography>
                            {/* --- CLAVE 2: Stack para espaciado uniforme --- */}
                            <Stack
                                direction='column'
                                spacing={5} // Espacio constante entre items
                                sx={{
                                    alignItems: 'flex-start',
                                    pl: { xs: 2, md: 5 },
                                }}
                            >
                                <ItemText
                                    progress={scrollYProgress}
                                    range={[0.53, 0.8]}
                                    text='Sus triunfos'
                                />
                                <ItemText
                                    progress={scrollYProgress}
                                    range={[0.58, 0.8]}
                                    text='Sus alegrías'
                                />
                                <ItemText
                                    progress={scrollYProgress}
                                    range={[0.65, 0.8]}
                                    text='Sus talentos'
                                />
                            </Stack>
                        </Box>
                    </Box>
                </SectionWrapper>

                {/* 5. FINAL */}
                <SectionWrapper progress={scrollYProgress} range={[0.8, 1]}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            backgroundImage: `url(${images.roseBack2})`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                        }}
                    >
                        <Grid
                            container
                            justifyContent='center'
                            alignItems='center'
                            spacing={2}
                            direction='column'
                        >
                            <Grid item>
                                <TypografyItem
                                    progress={scrollYProgress}
                                    range={[0.8, 0.83]}
                                    text='Sus XV años'
                                />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <TypografyItem
                                progress={scrollYProgress}
                                range={[0.84, 0.87]}
                                text={frase}
                            />
                        </Grid>
                    </Box>
                </SectionWrapper>
            </Box>

            {
                
            }
        </Box>
    );
};

// COMPONENTE DE CONTROL DE VISIBILIDAD MEJORADO
const SectionWrapper = ({ children, progress, range }) => {
    const opacity = useTransform(
        progress,
        [range[0], range[0] + 0.01, range[1] - 0.01, range[1]],
        [0, 1, 1, 0]
    );
    const visibility = useTransform(progress, (p) =>
        p >= range[0] && p <= range[1] ? 'visible' : 'hidden'
    );
    return (
        <motion.div
            style={{
                opacity,
                visibility,
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            {children}
        </motion.div>
    );
};

SectionWrapper.propTypes = {
    children: PropTypes.node,
    progress: PropTypes.number,
    range: PropTypes.array,
};

// COMPONENTE ITEMTEXT MODIFICADO

const ItemText = ({ text, progress, range }) => {
    // Animaciones para el texto
    const opacity = useTransform(progress, range, [0, 1]);
    const x = useTransform(progress, range, [-30, 0]); // Movimiento lateral más suave
    const blur = useTransform(progress, range, ['8px', '0px']);

    // Animación exclusiva para la rosa (ligera rotación y escala)
    const roseRotate = useTransform(progress, range, [-45, 0]);
    const roseScale = useTransform(progress, range, [0.5, 1]);

    return (
        <Box
            component={motion.div}
            style={{
                opacity,
                x,
                filter: `blur(${blur})`,
                display: 'flex',
                alignItems: 'center', // Alinea rosa y texto verticalmente
            }}
        >
            {/* --- CLAVE 3: La Rosa Dorada Animada --- */}
            <motion.div
                style={{
                    rotate: roseRotate,
                    scale: roseScale,
                    marginRight: '15px', // Espacio entre rosa y texto
                    display: 'flex',
                }}
            >
                <YardIcon
                    sx={{
                        fontSize: { xs: '1.5rem', md: '2.2rem' },
                        color: '#D4AF37', // Color dorado
                        filter: 'drop-shadow(0 0 5px #D4AF37)', // Brillo sutil
                    }}
                />
            </motion.div>

            <Typography
                variant='invitationSecondaryText' // Asumiendo que definiste esto en el theme
                sx={{
                    color: '#fff',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    fontWeight: 500,
                    fontSize: { xs: '2.4rem', md: '3.6rem' },
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

ItemText.propTypes = {
    text: PropTypes.string,
    progress: PropTypes.number,
    range: PropTypes.array,
};

const MelanieImage = ({ progress, range, image }) => {
    const opacity = useTransform(progress, range, [
        '0%',
        '100%',
        '100%',
        '100%',
    ]);

    const x = useTransform(progress, range, ['0%', '-10%', '-20%', '-30%']);
    return (
        <motion.div>
            <motion.img
                style={{ x, y: '10%', opacity }}
                src={image}
                alt='Melanie'
            />
        </motion.div>
    );
};

MelanieImage.propTypes = {
    progress: PropTypes.number,
    range: PropTypes.array,
    image: PropTypes.string,
};

const TypografyItem = ({ progress, range, text }) => {
    const opacity = useTransform(progress, range, ['0%', '100%']);
    const width = useTransform(progress, range, ['0', `${text.length}ch`]);
    const x = useTransform(progress, range, ["0%","1%"])

    return (
        <motion.div style={{ opacity, x, display:"flex", justifyContent:"center", width:"100%" }}>
            <Typography
                variant='invitationFont'
                sx={{
                    color: '#D4AF37',
                    fontWeight: 'bold', // Ancho basado en la longitud del texto
                    backgroundColor:"transparent",
                    textAlign: 'center',
                    
                }}
            >
                {text}
            </Typography>
        </motion.div>
    );
};

TypografyItem.propTypes = {
    children: PropTypes.node,
    progress: PropTypes.number,
    range: PropTypes.array,
};
