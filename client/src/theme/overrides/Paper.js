export default function Paper(theme) {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backGroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary
                }
            }
        }
    }
}
