'use client'

import React, { useReducer } from "react";

let initialState = {
    status: false,
    nome: '',
    cpf: '',
    email: '',
    unidade: '',
    matricula: '',
    token: '',
    admin: false
}

const reducer = (state, action) => {
    switch(action.type){
        case 'logIn':
            return { 
                ...state, 
                status: true,
                nome: action.payload.payload.nome, 
                cpf: action.payload.payload.cpf, 
                email: action.payload.payload.email,
                matricula: action.payload.payload.matricula,
                unidade: action.payload.payload.unidade,
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
                unidade: '',
                token: '',
                admin: false
            }
        default:
            return state
    }
}

export const Context = React.createContext({ state: initialState, dispatch: () => reducer });

export const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Context.Provider value={{state, dispatch}}>
            {children}
        </Context.Provider>
    )
    
}