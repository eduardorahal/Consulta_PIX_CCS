'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import MenuLayout from './components/Menu/MenuLayout'
import React from 'react'
import { Box } from '@mui/material'
import { useContext } from 'react'
import { Provider, Context } from './context'
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'LAB-LD',
  description: 'Laboratório de Tecnologia contra Lavagem de Dinheiro'
}

const Layout = ({ children }) => {

  const pathname = usePathname();
  const noMenuPaths = ['/auth/login', '/auth/logout'];

  const { state, dispatch } = useContext(Context);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Box sx={{ display: 'flex' }}>
          {noMenuPaths.includes(pathname) ? null : <MenuLayout />}
          <Box paddingTop={2} paddingLeft={2} >
            <main>{children}</main>
          </Box>
        </Box>
      </body>
    </html>
  )
}

const RootLayout = ({ children }) => (
  <Provider>
    <Layout>
      {children}
    </Layout>
  </Provider>
)

export default RootLayout