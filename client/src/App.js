import React from "react";
import { HashRouter as Router } from "react-router-dom";
import BackEnd from "./pages/BackEnd";
import { AccountContextProvider } from "./contexts/AccountContext";

function App() {
  return (
    <AccountContextProvider>
      <div>
        <Router>
          <BackEnd />
        </Router>
      </div>
    </AccountContextProvider>
  );
}

export default App;
