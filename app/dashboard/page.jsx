'use client'

import React, { useContext, useEffect } from 'react';
import { Context } from '../context';

const Dashboard = () => {

    const { state, dispatch } = useContext(Context);

    return (
        <div>
                <div>
                    <h2>Login Information</h2>
                    <p>Username: {state.nome}</p>
                    {/* Add more details based on your login information structure */}
                </div>

                <p>Loading login information...</p>
                Hello, {state.nome ? state.nome : <div>Loading...</div>}
        </div>
    )
}

export default () => (
      <Dashboard />
  )