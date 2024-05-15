'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import MenuLayout from './components/Menu/MenuLayout'
import React from 'react'
import { Box } from '@mui/material'
import { useEffect, useContext } from 'react'
import { Provider, Context } from './context'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'LAB-LD',
  description: 'Laboratório de Tecnologia contra Lavagem de Dinheiro'
}

const Layout = ({ children }) => {

  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    window.parent.postMessage("ask for credentials", "*");
    const handleMessage = async (event) => {
      // Check if the message is from the parent
      if (event.source === window.parent) {
        // Handle the received data
        if (event.data?.userData) {
          const authInfo = await JSON.parse(event.data.userData)
          dispatch({type: 'setCredentials', payload: {authInfo: authInfo, status: true}})
        }
      }
    };
    window.addEventListener('message', handleMessage);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Box sx={{ display: 'flex' }}>
          {
            state.status && <>
              <MenuLayout />
              <Box paddingTop={2} paddingLeft={2} >
                <main>{children}</main>
              </Box>
            </>
          }
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