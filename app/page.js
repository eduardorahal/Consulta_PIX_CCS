'use client'

import { Context, Provider } from './context';
import Dashboard from './dashboard/page';
import React, { useEffect, useState, useContext } from 'react'

const Home = ({ children }) => {

  const [status, setStatus] = useState(false) 
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    window.parent.postMessage("ask for credentials", "*");
    const handleMessage = async (event) => {
      // Check if the message is from the parent
      if (event.source === window.parent) {
        // Handle the received data
        if (event.data?.userData) {
          const authInfo = await JSON.parse(event.data.userData)
          dispatch({type: 'setCredentials', payload: authInfo})
          setStatus(true)
        }
      }
    };
    window.addEventListener('message', handleMessage);
  });

  return (
      status && <Dashboard />
  )

}

export default Home