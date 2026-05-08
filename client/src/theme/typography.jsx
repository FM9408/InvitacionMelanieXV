// ----------------------------------------------------------------------

export function remToPx(value) {
    return Math.round(Number.parseFloat(value) * 16)
}

export function pxToRem(value) {
    return `${value / 16}rem`
}

export function responsiveFontSizes({ sm, md, lg }) {
    return {
        '@media (min-width:600px)': {
            fontSize: pxToRem(sm)
        },
        '@media (min-width:900px)': {
            fontSize: pxToRem(md)
        },
        '@media (min-width:1200px)': {
            fontSize: pxToRem(lg)
        }
    }
}

// ----------------------------------------------------------------------

const FONT_PRIMARY = "'Tangerine Bold', sans-serif" // Google Font
// const FONT_SECONDARY = 'CircularStd, sans-serif'; // Local Font

const typography = {
    fontFamily: FONT_PRIMARY,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
        fontWeight: 800,
        lineHeight: 80 / 64,
        fontSize: pxToRem(40),
        ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 })
    },
    h2: {
        fontWeight: 800,
        lineHeight: 64 / 48,
        fontSize: pxToRem(32),

        ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 })
    },
    h3: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(24),
        ...responsiveFontSizes({ sm: 24, md: 30, lg: 32 })
    },
    h4: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(40),
        ...responsiveFontSizes({ sm: 30, md: 35, lg: 40 })
    },
    invitationSecondaryText: {
        fontSize: pxToRem(20),
        ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 })
    },
    adminH4: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(20),
        fontFamily: 'Dancing Script',
        ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 })
    },
    h5: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(18),

        ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 })
    },
    h6: {
        fontWeight: 700,
        lineHeight: 28 / 18,
        fontSize: pxToRem(48),
        ...responsiveFontSizes({ sm: 30, md: 40, lg: 50 })
    },
    adminH6: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 700,
      lineHeight: 28 / 18,
      fontSize: pxToRem(25),
      ...responsiveFontSizes({ sm: 25, md: 30, lg: 35})
   
    },
    subtitle1: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(30)
    },
    adminSubtitle1: {
        fontWeight: 700,
        fontFamily: "Roboto, sans-serif",
        lineHeight: 1.5,
        fontSize: pxToRem(20)
    },
    subtitle2: {
        fontWeight: 600,
        lineHeight: 22 / 14,
        fontSize: pxToRem(14)
    },
    body1: {
        lineHeight: 1,
        fontSize: pxToRem(30)
    },
    body2: {
        lineHeight: 22 / 14,
        fontSize: pxToRem(28)
    },
    caption: {
        lineHeight: 1.5,
        fontSize: pxToRem(20),
    },
    adminCaption: {
        lineHeight: 1.5,
        fontFamily: "Roboto, sans-serif",
        fontSize: pxToRem(13),
    },
    overline: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(12),
        textTransform: 'uppercase'
    },
    button: {
        fontWeight: 700,
        lineHeight: 24 / 14,
        fontSize: pxToRem(20),
        textTransform: 'capitalize'
    },
    messageTitle: {
        lineHeight: 22 / 14,
        fontFamily: 'Dancing Script',
        fontSize: pxToRem(20)
    },
    messageBody: {
        lineHeight: 1.5,
        fontFamily: 'Dancing Script',
        fontSize: pxToRem(17)
    },
    invitationFont: {
        lineHeight: 1.5,
        fontFamily: "Luxurious Script",
        fontSize: pxToRem(90)

    },
    SearchFont: {
        fontFamily: "Imperial Script",
        fontSize: pxToRem(40)

    },
    messageDate: {
        lineHeight: 1.5,
        fontSize: pxToRem(12),
        fontFamily: 'Dancing Script'
    },
    invitadoName: {
        lineHeight: 1.5,
        fontSize: pxToRem(30),
        fontFamily: 'Luxurious Script'
    }
}

export default typography
