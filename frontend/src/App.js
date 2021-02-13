import "./assets/styles/App.css";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginContainer from "./containers/LoginContainer";
import RegisterContainer from "./containers/RegisterContainer";
import DashboardContainer from "./containers/DashboardContainer";
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={LoginContainer} />
          <Route exact path="/register" component={RegisterContainer} />
          <Route exact path="/dashboard" component={DashboardContainer} />
        </div>
      </Router>
    );
  }
}

export default App;
