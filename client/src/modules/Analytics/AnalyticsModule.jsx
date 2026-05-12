import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'
import { Box, useTheme } from '@mui/material'
import { useSelector } from 'react-redux';
import React from 'react';

// Datos de ejemplo: Confirmaciones por día

// const data = [
//     { fecha: '01 Mar', confirmados: 1 },
//     { fecha: '05 Mar', confirmados: 12 },
//     { fecha: '10 Mar', confirmados: 25 },
//     { fecha: '15 Mar', confirmados: 40 }
// ]

const buildConfirmedData = (invitados) => {
    const countsByDate = {}

    invitados.forEach((familia) => {
        if (!familia.miembros) return
        countsByDate['01 05'] =0
        familia.miembros.forEach((miembro) => {
            
            if (miembro.willAssist !== 'Confirmado' || !miembro.confirmationDate) return

            const fecha = miembro.confirmationDate
                .split('T')[0]
                .split('-')
                .reverse()
                .join(' ')

            countsByDate[fecha] = (countsByDate[fecha] || 0) +1
        })

    })

    return Object.entries(countsByDate).map(([fecha, confirmados]) => ({
        fecha: fecha.split(' ').join('/').slice(0,5),
        confirmados
    }))
}

const AnalyticsModule = () => {
    const { familias } = useSelector((state) => state.familias)
    const { invitados } = useSelector((state) => state.admin)
    const data = React.useMemo(() => buildConfirmedData(invitados), [invitados])
    const theme = useTheme()


    React.useEffect(() => {
      console.log(data)
    }, [data, familias])


    return (
        <Box sx={{ p: 2, width: '100%', height: { xs: 300, md: 170 } }}>
            <ResponsiveContainer>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id='colorConf'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                        >
                           
                            <stop
                                offset='5%'
                                stopColor={theme.palette.primary.dark}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset='60%'
                                stopColor={theme.palette.primary.main}
                                stopOpacity={.3}
                            />  
                            <stop
                                offset='95%'
                                stopColor={theme.palette.primary.light}
                                stopOpacity={0.01}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid color={theme.palette.secondary.main}  vertical={true} />
                    <XAxis dataKey='fecha' />
                    <YAxis dataKey={"confirmados"} />
                    <Tooltip />
                    <Area
                        type='bump'
                        dataKey='confirmados'
                        stroke={theme.palette.primary.dark}
                        fillOpacity={1}
                        fill='url(#colorConf)'
                        animationBegin={400}
                        animationDuration={1100}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    )
}

export default AnalyticsModule
