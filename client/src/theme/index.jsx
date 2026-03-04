import {
    ThemeProvider,
    createTheme,
    StyledEngineProvider
} from '@mui/material/styles'
import { palette } from './palette'
import typography from './typography'
import { CssBaseline } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

InvitationThemeProvider.propTypes = {
    children: PropTypes.node
}

export default function InvitationThemeProvider({ children }) {
    const themeOptions = React.useMemo(() => ({
        palette,
        typography
    }), [])
    const theme = createTheme(themeOptions)

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
