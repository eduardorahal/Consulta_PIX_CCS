'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Menu from './components/Menu'
import React from 'react'
import { Provider } from './context';
import { Box } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'LAB-LD',
  description: 'Laboratório de Tecnologia contra Lavagem de Dinheiro'
}

const RootLayout = ({ children }) => {

  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider>
        <Box sx={{ display: 'flex' }}>
          <Menu />
          <Box paddingTop={10} paddingLeft={2} >
            <main>{children}</main>
          </Box>
        </Box>
        </Provider>
      </body>
    </html>
  )
}

export default ({children}) => (
  
    <RootLayout>
      {children}
    </RootLayout>
  
)