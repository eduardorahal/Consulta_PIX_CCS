import Menu from './Menu'
import { Box } from '@mui/material'
import { MenuProvider } from './menuContext'

const MenuLayout = ({ children }) => {

    return (
        <Box sx={{ display: 'flex' }}>
            <Menu />
        </Box>
    )
}

export default ({ children }) => (
    <MenuProvider>
        <MenuLayout>
            {children}
        </MenuLayout>
    </MenuProvider>
)