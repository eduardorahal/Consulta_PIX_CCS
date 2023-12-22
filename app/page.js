'use client'

import Dashboard from './dashboard/page';
import React, {useEffect, useState} from 'react'

const Home = ({children}) => {

  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    window.parent.postMessage("ask for credentials", "*");
    const handleMessage = async (event) => {
      // Check if the message is from the parent
      if (event.source === window.parent) {
        // Handle the received data
        if (event.data?.userData) {
            setLoginInfo(await JSON.parse(event.data.userData))
        }
      }
    };
    window.addEventListener('message', handleMessage);
  }, []);

  return (
    <Dashboard loginInfo={loginInfo} />
  )

}
export default Home