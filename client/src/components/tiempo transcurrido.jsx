import { useState, useEffect } from 'react';
import { Typography, Tooltip, useTheme } from '@mui/material';

export default function TiempoTranscurrido({ fechaIso, kind }) {
    const [textoTiempo, setTextoTiempo] = useState('');
    const theme = useTheme();

    // Convierte la fecha ISO de la API a un formato local legible para el Tooltip
    const fechaExacta = new Date(fechaIso).toLocaleString();

    useEffect(() => {
        function calcularDiferencia() {
            const timestamp = new Date(fechaIso).getTime();
            if (isNaN(timestamp)) return 'Fecha inválida';

            const ahora = Date.now();
            const diferenciaSegundos = Math.floor((ahora - timestamp) / 1000);

            // Si el reloj del cliente está desincronizado con el servidor
            if (diferenciaSegundos < 0) return 'Hace un momento';

            if (diferenciaSegundos < 60) return 'Hace un momento';

            const minutos = Math.floor(diferenciaSegundos / 60);
            if (minutos < 60)
                return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;

            const horas = Math.floor(minutos / 60);
            if (horas < 24)
                return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;

            const dias = Math.floor(horas / 24);
            if (dias < 30) return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;

            const meses = Math.floor(dias / 30);
            return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
        }

        // Calcula inmediatamente al renderizar
        setTextoTiempo(calcularDiferencia());

        // Actualiza el texto internamente en el cliente cada 60 segundos
        const intervalo = setInterval(() => {
            setTextoTiempo(calcularDiferencia());
        }, 60000);

        // Limpia el intervalo para evitar fugas de memoria (memory leaks)
        return () => clearInterval(intervalo);
    }, [fechaIso]);

    return (
        <Tooltip title={fechaExacta} arrow placement='top'>
            {
                kind === "mensaje" ?  <Typography
                variant= 'adminCaption'
                sx={{
                    mt: 2,
                    color: theme.palette.text.secondary,
                    textAlign: 'right',
                    fontWeight: 'bold',
                }}
            >
                {textoTiempo}
                </Typography> :
                    <Typography variant="caption" sx={{mt:-2, px:1}}>
                                                    {textoTiempo}
                                                </Typography>
           }
        </Tooltip>
    );
}
