'use client'

import React, { useReducer, useEffect } from "react";

let initialState = {
    status: false,
    nome: '',
    cpf: '',
    email: '',
    lotacao: '',
    matricula: '',
    token: '',
    admin: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'logIn':
            return {
                ...state,
                status: true,
                nome: action.payload.payload.nome,
                cpf: action.payload.payload.cpf,
                email: action.payload.payload.email,
                matricula: action.payload.payload.matricula,
                lotacao: action.payload.payload.lotacao,
                token: action.payload.token,
                admin: action.payload.payload.admin
            }
        case 'logOut':
            return {
                ...state,
                status: false,
                nome: '',
                cpf: '',
                email: '',
                matricula: '',
                lotacao: '',
                token: '',
                admin: false
            }
        default:
            return state
    }
}

export const Context = React.createContext({ state: initialState, dispatch: () => reducer });

export const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Retrieve user info from local storage
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            dispatch({ type: 'logIn', payload: JSON.parse(storedUser) })
        }
    }, []);

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )

}