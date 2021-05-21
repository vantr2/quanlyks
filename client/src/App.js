import React from "react";
import FrontEnd from "./pages/FrontEnd";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BackEnd from "./pages/BackEnd";
import { AccountContextProvider } from "./contexts/AccountContext";

function App() {
  return (
    <AccountContextProvider>
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={FrontEnd}></Route>
            {/* <Route exact path="/quan-ly" component={BackEnd}></Route> */}
            <BackEnd />
          </Switch>
        </Router>
      </div>
    </AccountContextProvider>
  );
}

export default App;
