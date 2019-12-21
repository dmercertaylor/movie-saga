import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch, Link} from 'react-router-dom';
import './App.css';
import HomePage from '../HomePage/HomePage';

class App extends Component {
  // Renders the entire app on the DOM
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path='/'>
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
