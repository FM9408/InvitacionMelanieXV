import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import melanieWRose from '../../assets/images/melanieWrose.png';
import { useScroll, useTransform, motion } from 'framer-motion';
import FamilyModal from '../FamilyModal/FamilyModal';
import PropTypes from 'prop-types';
import roseGarden from '../../assets/images/background.png';

const MarcoDorado = ({ imagen }) => (
    <Box
        sx={{
            width: { xs: '260px', md: '350px' }, // Ligeramente más pequeño para la apertura
            height: { xs: '350px', md: '490px' },
            border: '15px solid #D4AF37', // Dorado Perfeccionista
            borderBottom: '22px solid #B8962E', // Base del portarretrato
            backgroundImage: `url(${imagen})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 60px 100px rgba(0,0,0,0.8)',
            backgroundColor: '#1a1a1a',
        }}
    />
);

MarcoDorado.propTypes = {
    imagen: PropTypes.string,
};

export const InvitacionNarrativa = () => {
    const mainAudio = useRef(new Audio('/assets/audio/After_the_Masquerade.mp3'))
    const theme= useTheme()
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
        mainAudio.current.currentTime = 0
        mainAudio.current.play()
        const volumeInterval = setInterval(() => {
            if (volume < 1) {
                volume = Math.min(volume + 0.01, 1)
                mainAudio.current.volume = volume
            } else {
                clearInterval(volumeInterval)
            }
        }, 100)
        globalThis.removeEventListener("click", startAudio)
        globalThis.addEventListener("stop", stopMusic)
    }
    const stopMusic = () => {
        const volumeInterval = setInterval(() => {
            if (volume > 0) {
                volume = Math.max(volume - 0.01, 0)
                //--
                mainAudio.current.volume = volume
            } else {
                clearInterval(volumeInterval)
                mainAudio.current.pause()
                mainAudio.current.currentTime = 0
            }
        }, 100)
        globalThis.removeEventListener("start",startAudio)
    }
    const photosRotateX = useTransform(scrollYProgress, [0, 0.35], [85, 20]);
    const photosZ = useTransform(scrollYProgress, [0.2, 0.35], [-400, 0]);
    const leftPhotoX = useTransform(scrollYProgress, [0.2, 0.35], [0, -100]);
    let volume = 0
    const rightPhotoX = useTransform(scrollYProgress, [0.2, 0.35], [0, 100]);

    // Abrir modal al final
    useEffect(() => {
        mainAudio.current.loop = false
        globalThis.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        let requestID;
        const totalDurationMS = 30000; // 60 segundos
        const startTime = performance.now();
        if (modalOpen === false) {
            dispatchEvent(new Event('start'))
        } else {
            dispatchEvent(new Event('stop'))
        } 
        globalThis.addEventListener("restartInvitation", startAudio)
        const autoScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const totalScrollable =
                document.body.scrollHeight - window.innerHeight;
            const progress = Math.min(elapsedTime / totalDurationMS, 1);

            window.scrollTo(0, totalScrollable * progress);

            // FINAL DE LA ANIMACIÓN: Abrir modal forzosamente
            if (progress >= 1) {
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
            globalThis.addEventListener("start", startAudio)
            cancelAnimationFrame(requestID);
            globalThis.removeEventListener("click", startAudio)
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
                <SectionWrapper   progress={scrollYProgress} range={[0, 0.15]}>
                    <TypografyItem progress={scrollYProgress} range={[0, 0.15]}>
                        <Typography
                            variant='invitationFont'
                            sx={{ color: '#D4AF37', textAlign: 'center' }}
                        >
                            Hace XV años...
                        </Typography>
                    </TypografyItem>
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
                                // Evitamos 'translate' en style para no chocar con Framer
                            }}
                            sx={{
                                position: 'absolute',
                                width: { xs: '260px', md: '350px' },
                                height: { xs: '350px', md: '490px' },
                                pointerEvents: 'auto',
                                // Alineación absoluta pura sin 'transform' de CSS
                                left: '50%',
                                top: '50%',
                                marginLeft: { xs: '-130px', md: '-175px' }, // Mitad exacta del ancho
                                marginTop: { xs: '-175px', md: '-245px' }, // Mitad exacta del alto
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    border: '15px solid #D4AF37',
                                    borderBottom: '25px solid #B8962E',
                                    backgroundImage: 'url("/foto1.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#1a1a1a',
                                    boxShadow: '0 50px 80px rgba(0,0,0,0.8)',
                                }}
                            />
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
                                width: { xs: '260px', md: '350px' },
                                height: { xs: '350px', md: '490px' },
                                pointerEvents: 'auto',
                                left: '50%',
                                top: '50%',
                                marginLeft: { xs: '-130px', md: '-175px' },
                                marginTop: { xs: '-175px', md: '-245px' },
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    border: '15px solid #D4AF37',
                                    borderBottom: '25px solid #B8962E',
                                    backgroundImage: 'url("/foto2.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#1a1a1a',
                                    boxShadow: '0 50px 80px rgba(0,0,0,0.8)',
                                }}
                            />
                        </Box>
                    </Box>
                </SectionWrapper>
                {/*3. Texto "Ahora..." */}
                <SectionWrapper progress={scrollYProgress} range={[0.4, 0.5]}>
                    <Container>
                        <Box sx={{ textAlign: 'center' }}>
                            <TypografyItem
                                progress={scrollYProgress}
                                range={[0.4, 0.5]}
                            >
                                <Typography
                                    variant='invitationFont'
                                    sx={{
                                        color: '#D4AF37',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Ahora...
                                </Typography>
                            </TypografyItem>
                        </Box>
                    </Container>
                </SectionWrapper>

                {/* 4. CELEBRACIÓN */}
                <SectionWrapper progress={scrollYProgress} range={[0.55, 0.85]}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundImage: `url(${roseGarden})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 0,
                        }}
                    >
                        <Box
                            sx={{
                                width: '50%',
                                height: '80%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1,
                            }}
                        >
                            <MelanieImage
                                image={melanieWRose}
                                progress={scrollYProgress}
                                range={[0.55, 0.65, 0.75, 0.85]}
                            />
                        </Box>
                        <Box sx={{ textAlign: 'center', zIndex: 3 }}>
                            <Typography
                                variant='h3'
                                sx={{
                                    color: theme.palette.secondary.main,
                                    mb: 6,
                                    fontWeight: 'bold',
                                    zIndex: 1,
                                }}
                            >
                                ESTAMOS CELEBRANDO:
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4,
                                }}
                            >
                                <ItemText
                                    progress={scrollYProgress}
                                    range={[0.55, 0.85]}
                                    text='Sus triunfos'
                                />
                                <ItemText
                                    progress={scrollYProgress}
                                    range={[0.6, 0.85]}
                                    text='Sus alegrías'
                                />
                                <ItemText
                                    progress={scrollYProgress}
                                    range={[0.65, 0.85]}
                                    text='Sus talentos'
                                />
                            </Box>
                        </Box>
                    </Box>
                </SectionWrapper>

                {/* 5. FINAL */}
                <SectionWrapper progress={scrollYProgress} range={[0.85, 1]}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant='invitationFont'
                            sx={{
                                color: '#D4AF37',
                                fontWeight: 900,
                                fontSize: { xs: '4rem', md: '8rem' },
                            }}
                        >
                            Sus XV años
                        </Typography>
                    </Box>
                </SectionWrapper>
            </Box>

            <FamilyModal
                open={modalOpen}
                mode='Confirmar'
                onClose={() => setModalOpen(false)}
                setHasOpened={(e) => setHasOpened(e)}
            />
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

const ItemText = ({ text, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1]);
    const x = useTransform(progress, range, [-50, 0]);
    const blur = useTransform(progress, range, ['10px', '0px']);

    return (
        <motion.div style={{ opacity, x, filter: `blur(${blur})` }}>
            <Typography
                variant='invitationSecondaryText'
                sx={{
                    fontFamily: "'Cinzel', serif",
                    color: '#fff',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    borderLeft: '4px solid #D4AF37',
                    pl: 2,
                }}
            >
                {text}
            </Typography>
        </motion.div>
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
        <motion.div style={{ x, opacity }}>
            <img alt={'melanie'} src={image} />
        </motion.div>
    );
};

MelanieImage.propTypes = {
    progress: PropTypes.number,
    range: PropTypes.array,
    image: PropTypes.string,
};

const TypografyItem = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1]);

    return <motion.div style={{ opacity }}>{children}</motion.div>;
};

TypografyItem.propTypes = {
    children: PropTypes.node,
    progress: PropTypes.number,
    range: PropTypes.array,
};
