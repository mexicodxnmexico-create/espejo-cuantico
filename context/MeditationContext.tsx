import React, { createContext, useContext, useReducer } from 'react';

const MeditationContext = createContext();

const initialState = {
    sessions: [],  // Array to hold meditation session data
    progress: 0,   // Progress tracking (0-100)
    consciousnessLevel: 0 // Level of consciousness (0-10)
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_SESSION':
            return { ...state, sessions: [...state.sessions, action.payload] };
        case 'UPDATE_PROGRESS':
            return { ...state, progress: action.payload };
        case 'SET_CONSCIOUSNESS_LEVEL':
            return { ...state, consciousnessLevel: action.payload };
        default:
            return state;
    }
};

export const MeditationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <MeditationContext.Provider value={{ state, dispatch }}>
            {children}
        </MeditationContext.Provider>
    );
};

export const useMeditationContext = () => useContext(MeditationContext);
