import { Paper, Box, Typography, Icon } from '@mui/material'

const StatCard = ({
    title,
    value,
    icon: IconComponent,
    color = 'primary.main'
}) => {
    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 2,
                width: '100%',
                height: { xs: 120, md: 170 },
                display: 'flex',
                mt: 1,
                p: 1,
                flexDirection: { xs: 'row-reverse' },
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `5px solid`,
                borderColor: color
            }}
        >
            <Box
                sx={{
                    width: `${(100 / 5) * 4}%`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant='subtitle1'
                    color='text.secondary'
                    gutterBottom
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
                >
                    {title}
                </Typography>
                <Typography variant='h4' sx={{ fontWeight: 700 }}>
                    {value}
                </Typography>
            </Box>

            {IconComponent && (
                <Box
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '50%',
                        width: `${100 / 5}%`,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <IconComponent sx={{ color: color, fontSize: 32 }} />
                </Box>
            )}
        </Paper>
    )
}

export default StatCard
