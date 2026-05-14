// theme/globalStyles.jsx
import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => {
    return (
        <MuiGlobalStyles
            styles={{
                /* Forzamos que la barra exista pero sea invisible */
                '::-webkit-scrollbar': {
                    width: '8px !important',
                    height: '8px !important',
                    backgroundColor: 'transparent !important',
                },
                '::-webkit-scrollbar-thumb': {
                    backgroundColor: 'transparent !important',
                    borderRadius: '10px !important',
                },

                /* ESTO es lo que se activa al scrollear */
                'body.scrolling::-webkit-scrollbar-thumb': {
                    backgroundColor: '#D4AF37 !important', /* Tu dorado */
                    border: '2px solid rgba(0,0,0,0)', /* Margen transparente para que se vea más fina */
                    backgroundClip: 'padding-box',
                },

                /* Para Firefox (usa propiedades distintas) */
                'html': {
                    scrollbarWidth: 'none',
                },
                'html.scrolling': {
                    scrollbarWidth: 'none',
                    scrollbarColor: '#D4AF37 transparent',
                }
            }}
        />
    );
};

export default GlobalStyles;