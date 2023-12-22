'use client'

import React, { useReducer, useEffect } from "react";

let initialState = {
    nome: '',
    cargo: '',
    cpf: '',
    email: '',
    lotacao: '',
    matricula: '',
    token: '',
    menu: true
}

const reducer = (state, action) => {
    switch(action.type){
        case 'setCredentials':
            return { ...state, nome: action.payload.nome }
        case 'setMenu':
            return { ...state, menu: action.payload }
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