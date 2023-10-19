import './globals.css'
import Menu from './components/Menu'
import { Inter } from 'next/font/google'
import { Box } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LAB-LD',
  description: 'Laboratório de Tecnologia contra Lavagem de Dinheiro'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Box sx={{ display: 'flex' }}>
          <Menu />
          <Box paddingTop={10} paddingLeft={2} >
            {children}
          </Box>
        </Box>
      </body>
    </html>
  )
}
