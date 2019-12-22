import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import MovieList from '../MovieList/MovieList';
import MovieDetails from '../MovieDetails/MovieDetails';
import {connect} from 'react-redux';
import Navbar from '../Navbar/Navbar';
import EditPage from '../EditPage/EditPage';

class App extends Component {
  // Renders the entire app on the DOM
  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <Switch>
            <Route exact path='/'>
              <MovieList payload={{noDescription: true}} />
            </Route>
            <Route exact path="/genre/:genre">
              <MovieList payload={{ noDescription: true }} />
            </Route>
            <Route path="/details/:id">
              <MovieDetails />
            </Route>
            <Route path="/edit/:id">
              <EditPage />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect()(App);
