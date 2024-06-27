import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { StartPage } from "./pages/start/StartPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
