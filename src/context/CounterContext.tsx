// CounterContext.tsx
import React, { Dispatch, createContext, useReducer } from "react";

// Define the shape of our state and actions
interface State {
  count: number;
}

type Action = { type: "increment" } | { type: "decrement" };

const initialState: State = { count: 0 };

// Create the reducer function
const counterReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// Create the Context
const CounterContext = createContext<
  { state: State; dispatch: Dispatch<Action> } | undefined
>(undefined);

// Create a Provider component
const CounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
};

export { CounterContext, CounterProvider };
