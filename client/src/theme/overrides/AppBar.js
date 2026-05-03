export default function AppBar(theme) {
    return {
        MuiAppBar: {
            variants: [
                {
                    props: { variant: 'admin' },
                    style: {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        boxShadow: `1px 1px 5px  ${theme.palette.secondary.dark}`,
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: '5px'
                    }
                }
            ]
        }
    }
}
