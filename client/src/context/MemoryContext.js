import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useRef,
} from "react";

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
    case "START_TIMER":
      return { ...state, isTimerRunning: true };
    case "STOP_TIMER":
      return { ...state, isTimerRunning: false };
    case "RESET_TIMER":
      return { ...state, time: 0, isTimerRunning: false };
    case "TICK":
      return { ...state, time: state.time + 1 };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    size: null,
    numberOfPlayers: null,
    currentUser: null,
    time: 0,
    isTimerRunning: false,
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (state.isTimerRunning) {
      timerRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [state.isTimerRunning]);

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
