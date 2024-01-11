'use client'

import React, { useReducer } from "react";

let initialState = {
    open: true
}

const reducer = (state, action) => {
    switch(action.type){
        case 'setMenu':
            return { ...state, open: action.payload }
        default:
            return state
    }
}

export const MenuContext = React.createContext({ state: initialState, dispatch: () => reducer });

export const MenuProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <MenuContext.Provider value={{state, dispatch}}>
            {children}
        </MenuContext.Provider>
    )
    
}