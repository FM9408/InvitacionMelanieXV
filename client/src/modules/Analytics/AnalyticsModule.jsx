import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts'
import { Box } from '@mui/material'

// Datos de ejemplo: Confirmaciones por día
const data = [
    { fecha: '01 Mar', confirmados: 1 },
    { fecha: '05 Mar', confirmados: 12 },
    { fecha: '10 Mar', confirmados: 25 },
    { fecha: '15 Mar', confirmados: 40 }
]

const AnalyticsModule = () => {
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
                                stopColor='#AF1310'
                                stopOpacity={0.8}
                            />
                            <stop
                                offset='95%'
                                stopColor='#AF1310'
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='fecha' />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type='monotone'
                        dataKey='confirmados'
                        stroke='#AF1310'
                        fillOpacity={1}
                        fill='url(#colorConf)'
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    )
}

export default AnalyticsModule
