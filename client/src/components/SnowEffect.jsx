import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const SnowEffect = () => {
    const [init, setInit] = useState(false);

    // Inicializamos el motor de partículas una sola vez
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = {
        background: {
            color: "transparent", // Para que se vea sobre tu fondo "crema" o "Mundet"
        },
        particles: {
            number: {
                value: 150, // Cantidad de copos
                density: { enable: true, area: 800 }
            },
            color: { value: "#fff" }, // Copos blancos
            shape: { type: "circle" },
            opacity: {
                value: { min: 0.1, max: 0.5 }, // Unos más brillantes que otros
                animation: { enable: true, speed: 1 }
            },
            size: {
                value: { min: 1, max: 3 }, // Tamaños variados
            },
            move: {
                enable: true,
                speed: 1.5, // Velocidad de caída
                direction: "bottom", // Caen hacia abajo
                straight: false, // Movimiento oscilante (viento)
                outModes: { default: "out" },
            },
            wobble: {
                enable: true, // Efecto de balanceo al caer
                distance: 10,
                speed: 10
            }
        }
    };

    if (init) {
        return <Particles id="tsparticles" options={options} />;
    }

    return null;
};

export default SnowEffect;