import React,{Component} from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import MovieCard from '../MovieCard/MovieCard';

class MovieList extends Component{
  componentDidMount(){
    this.getMovies();
  }

  componentDidUpdate(prevProps){
    if(prevProps.location !== this.props.location){
      this.getMovies();
    }
  }

  getMovies = () => {
    const payload = {...this.props.payload, ...this.props.match.params};
    this.props.dispatch({
      type: 'GET_MOVIES',
      payload: payload
    });
  }

  render(){
    return (
      <div>
        {this.props.movies.map(movie => {
          return <MovieCard key={movie.id} movie={movie} />
        })}
      </div>
    )
  }
}

export default withRouter(
  connect((r)=>({movies: r.moviesReducer}))(MovieList)
);