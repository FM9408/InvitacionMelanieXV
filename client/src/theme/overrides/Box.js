export default function Box(theme) {
    return {
        MuiBox: {
            styleOverrides: {
                root: {
                    backGroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    display: 'flex',
                    justifyContent: 'center'
                }
            }
        }
    }
}
