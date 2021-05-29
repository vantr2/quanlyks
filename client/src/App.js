import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import BackEnd from "./pages/BackEnd";
import { AccountContextProvider } from "./contexts/AccountContext";

function App() {
  return (
    <AccountContextProvider>
      <div>
        <Router>
          <Switch>
            <BackEnd />
          </Switch>
        </Router>
      </div>
    </AccountContextProvider>
  );
}

export default App;
