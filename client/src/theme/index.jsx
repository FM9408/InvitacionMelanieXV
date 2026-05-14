import {
    ThemeProvider,
    createTheme,
    StyledEngineProvider
} from '@mui/material/styles'
import { palette } from './palette'
import componentsOverrides from './overrides'
import GlobalStyles from './globalStyles'
import typography from './typography'
import CssBaseline  from '@mui/material/CssBaseline'
import PropTypes from 'prop-types'
import React from 'react'

InvitationThemeProvider.propTypes = {
    children: PropTypes.node
}

export default function InvitationThemeProvider({ children }) {
    const themeOptions = React.useMemo(
        () => ({
            palette,
            typography,
        }),
        []
    )
    const theme = createTheme(themeOptions)
    theme.components = componentsOverrides(theme)
    

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
