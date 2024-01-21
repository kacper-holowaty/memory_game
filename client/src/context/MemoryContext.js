import React, { createContext, useReducer, useContext, useEffect } from "react";

const MemoryContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SIZE":
      return {
        ...state,
        size: action.payload,
      };
    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    case "SET_SOCKET":
      return {
        ...state,
        socket: action.payload,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    size: null,
    numberOfPlayers: null,
    currentUser: null,
    socket: null,
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    dispatch({ type: "SET_SOCKET", payload: socket });

    return () => {
      socket.close();
    };
  }, []);
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
