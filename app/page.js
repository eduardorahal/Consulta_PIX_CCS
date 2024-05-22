'use client'

import { Context, Provider } from './context';
import Dashboard from './dashboard/page';
import React, { useState, useContext } from 'react'

const Home = ({ children }) => {

  const { state, dispatch } = useContext(Context);

  return (
      <Dashboard />
  )

}

export default Home