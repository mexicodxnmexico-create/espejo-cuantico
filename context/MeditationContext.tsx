import React, { createContext, useContext, useReducer, useMemo } from 'react';

const MeditationContext = createContext();

export const initialState = {
    sessions: [],  // Array to hold meditation session data
    progress: 0,   // Progress tracking (0-100)
    consciousnessLevel: 0 // Level of consciousness (0-10)
};

export const reducer = (state, action) => {
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

    // ⚡ BOLT OPTIMIZATION: Memoize context provider value to prevent
    // unnecessary re-renders of consumer components when the provider's parent re-renders.
    const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <MeditationContext.Provider value={value}>
            {children}
        </MeditationContext.Provider>
    );
};

export const useMeditationContext = () => useContext(MeditationContext);
