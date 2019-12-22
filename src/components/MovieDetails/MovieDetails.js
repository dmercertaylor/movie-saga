import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Axios from 'axios';
import MovieCard from '../MovieCard/MovieCard';
import { Button } from '@material-ui/core';

const styles = theme => ({
    detailsCard: {
        color: 'white',
    },
    editButton: {
        position: 'absolute',
        top: '0px',
        right: '3px',
        margin: '1rem',
        backgroundColor: '#444455',
        color: 'white',
        '&:hover':{
            backgroundColor: '#555566'
        }
    }
})

class MovieDetails extends Component{
    state = {
        movie: null
    }

    componentDidMount(){
        this.getDetails();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.location !== this.props.location){
            this.getDetails();
        }
    }

    getDetails =() =>{
        Axios.get(`/api/movies/${this.props.match.params.id}`)
        .then(response => {
            this.setState({
                movie: response.data
            });
        }).catch(err=>{
            console.log(err);
        });
    }

    editMovie = () => {
        this.props.history.push(`/edit/${this.props.match.params.id}`)
    }

    render(){
        const classes = this.props.classes;
        const movie = this.state.movie;
        if(this.state.movie){
            return(
                <div className={classes.detailsCard}>
                    <Button className={classes.editButton}
                    variant="contained"
                    onClick={this.editMovie}
                    >Edit</Button>
                    <MovieCard movie={movie} />
                </div>
            );
        } else {
            return(
                <div className={classes.detailsCard}>
                    <p>Loading...</p>
                </div>
            )
        }
    }
}

export default withRouter(
    withStyles(styles)(
        connect()(MovieDetails)
    )
);