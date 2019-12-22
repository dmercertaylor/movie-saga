import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import MovieCardStyle from '../../styles/MovieCard.style';

class MovieCard extends Component{
    state = {
        genres: []
    }

    componentDidMount(){
        this.getGenres();
    }

    getGenres = () => {
        const movie = this.props.movie;
        axios.get(`/api/genres/${movie.id}`)
            .then(response => {
                this.setState({
                    genres: response.data
                });
            }).catch(err => console.log(err));
    }

    toGenre = genre => event => {
        event.stopPropagation();
        this.props.history.push(`/genre/${genre}`);
    }

    toDetails = id => event => {
        event.stopPropagation();
        this.props.history.push(`/details/${id}`);
    }

    render(){
        const movie = this.props.movie;
        const classes = this.props.classes;
        let details;
        if(movie.description){
            details = (
                <p>{movie.description}</p>
            )
        } else {
            details = (
                <div className={classes.detailsContainer}>
                    <Button variant="contained" onClick={this.toDetails(movie.id)}>
                        Details
                    </Button>
                </div>
            );
        }

        return(
            <div key={movie.id} className={classes.movieCard}>
                <div className={classes.row}>
                    <img onClick={(movie.description)?null:this.toDetails(movie.id)}
                        src={movie.poster} alt={movie.title}
                        className={classes.poster} />
                    <div className={classes.infoCard}>
                        <h2>{movie.title}</h2>
                        {this.state.genres.map((genre, i) => {
                            if(genre.name === this.props.currentDisplay){
                                return null;
                            }
                            return (
                                <Button key={i} className={classes.button}
                                onClick={this.toGenre(genre.name)} variant="contained">
                                    {genre.name}
                                </Button>
                            )
                        }).filter(a => a !== null)}
                        {details}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(
    withStyles(MovieCardStyle)(
        connect((r)=>({currentDisplay: r.display}))(MovieCard)
    )
);