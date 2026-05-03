export default function Button(theme) {
    return {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'admin' },
                    style: {
                        backgroundColor: theme.palette.primary.ligth,
                        color: theme.palette.primary.contrastText,
                        display: 'inline',
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.dark
                        }
                    }
                }
            ]
        }
    }
}
