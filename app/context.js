'use client'

import React, { useReducer } from "react";

let initialState = {
    nome: '',
    cpf: '',
    cargo: '',
    email: '',
    lotacao: '',
    matricula: '',
    token: ''
}

const reducer = (state, action) => {
    switch(action.type){
        case 'setCredentials':
            return { 
                ...state, 
                nome: action.payload.nome, 
                cpf: action.payload.cpf, 
                cargo: action.payload.cargo, 
                email: action.payload.email,
                matricula: action.payload.matricula,
                lotacao: action.payload.lotacao_nome,
                token: action.payload.token,
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