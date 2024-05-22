import Menu from './Menu'
import { Box } from '@mui/material'
import { MenuProvider } from './menuContext'
import withAuth from '@/app/auth/withAuth';

function Layout ({ children }) {

    return (
        <Box sx={{ display: 'flex' }}>
            <Menu />
        </Box>
    )
}

const MenuLayout = ({ children }) => (
    <MenuProvider>
        <Layout>
            {children}
        </Layout>
    </MenuProvider>
)

export default withAuth(MenuLayout)