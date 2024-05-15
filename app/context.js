'use client'

import React, { useReducer } from "react";

let initialState = {
    status: false,
    nome: '',
    cpf: '',
    cargo: '',
    email: '',
    lotacao: '',
    matricula: '',
    token: '',
}

const reducer = (state, action) => {
    switch(action.type){
        case 'setCredentials':
            return { 
                ...state, 
                status: action.payload.status,
                nome: action.payload.authInfo.nome, 
                cpf: action.payload.authInfo.cpf, 
                cargo: action.payload.authInfo.cargo, 
                email: action.payload.authInfo.email,
                matricula: action.payload.authInfo.matricula,
                lotacao: action.payload.authInfo.lotacao_nome,
                token: action.payload.authInfo.token,
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