import './globals.css'
import { Inter } from 'next/font/google'
import MenuLayout from './components/Menu/MenuLayout'
import React from 'react'
import { Box } from '@mui/material'
import { Provider, Context } from './context'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'LAB-LD',
  description: 'Laboratório de Tecnologia contra Lavagem de Dinheiro'
}

const RootLayout = ({ children }) => {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Box sx={{ display: 'flex' }}>
          <MenuLayout />
          <Box paddingTop={10} paddingLeft={2} >
            <main>{children}</main>
          </Box>
        </Box>
      </body>
    </html>
  )
}

export default ({ children }) => (
  <Provider>
    <RootLayout>
      {children}
    </RootLayout>
  </Provider>

)