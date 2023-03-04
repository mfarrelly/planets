import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { World } from "./world";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="card">
        <World />
      </div>
    </div>
  );
}

export default App;
