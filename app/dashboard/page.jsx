'use client'

import React, { useContext, useEffect } from 'react';
import { Context } from '../context';

const Dashboard = ({loginInfo}) => {

    const { state, dispatch } = useContext(Context);

    return (
        <div>
            {loginInfo ? (
                <div>
                    <h2>Login Information</h2>
                    <p>Username: {loginInfo.nome}</p>
                    {/* Add more details based on your login information structure */}
                </div>
            ) : (
                <p>Loading login information...</p>
            )}
            Hello, {state.nome ? state.nome : <div>Loading...</div>}
        </div>
    )
}

export default Dashboard;