import React, { createContext, useReducer, useContext } from "react";

const MemoryContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SIZE":
      return {
        ...state,
        size: action.payload,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    size: null,
    numberOfPlayers: null,
  });

  const contextValue = {
    state,
    dispatch,
  };

  return (
    <MemoryContext.Provider value={contextValue}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("Nieprawidłowe użycie kontekstu!");
  }
  return context;
};
