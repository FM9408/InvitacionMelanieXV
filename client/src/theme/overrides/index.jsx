import Button from './Button'
import AppBar from './AppBar'
import Box from './Box'
import Paper from './Paper'

export default function componentsOverrides(theme) {
    return Object.assign(Button(theme), AppBar(theme), Box(theme), Paper(theme))
}
