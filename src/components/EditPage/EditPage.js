import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';
import MovieCardStyle from '../../styles/MovieCard.style';
import EditPageStyle from './EditPage.style';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';


class EditPage extends Component{
    state = {
        titleDidChange: false,
        descriptionDidChange: false,
        movie: {id: this.props.match.params.id},
        genres: [],
        genresToAdd: [],
        genresToRemove: [],
        genreToAdd: ''
    }

    componentDidMount(){
        this.getDetails();
        this.getGenres();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.location !== this.props.location){
            this.getDetails();
        }
    }

    getGenres = () => {
        const movie = this.state.movie;
        axios.get(`/api/genres/${movie.id}`)
            .then(response => {
                this.setState({
                    genres: response.data
                });
            }).catch(err => console.log(err));
        this.props.dispatch({type: 'GET_GENRES'})
    }

    getDetails =() =>{
        axios.get(`/api/movies/${this.props.match.params.id}`)
        .then(response => {
            this.setState({
                ...response.data
            });
        }).catch(err=>{
            console.log(err);
        });
    }

    handleTextInput = stateProp => event => {
        const didChange = stateProp + 'DidChange'
        this.setState({
            [stateProp]: event.target.value,
            [didChange]: true
        });
    }

    toggleGenre = genre => event => {
        let index = this.state.genres.indexOf(genre);
        if(index !== -1){
            let newGenres = this.state.genres;
            newGenres.splice(index, 1);
            this.setState({
                genres: newGenres,
                genresToRemove: [...this.state.genresToRemove, genre]
            });
        } else {
            index = this.state.genresToRemove.indexOf(genre);
            let newGenres = this.state.genresToRemove;
            newGenres.splice(index, 1);
            this.setState({
                genres: [...this.state.genres, genre],
                genresToRemove: newGenres
            });
        }
    }

    saveChanges = () => {
        const data = {};
        if(this.state.titleDidChange){
            data.title = this.state.title;
        }
        if(this.state.descriptionDidChange){
            data.description = this.state.description;
        }

        let putRoute = (this.state.descriptionDidChange || this.state.titleDidChange);
        let deleteRoute = (this.state.genresToRemove.length > 0);
        let postRoute = (this.state.genresToAdd.length > 0)
        if(putRoute){
            axios.put(`/api/movies/${this.state.id}`, data)
                .then(response => {
                    if(!deleteRoute && !postRoute){
                        this.cancleChanges();
                    }
                });
        }

        if(deleteRoute){
            this.state.genresToRemove.forEach(genre => {
                axios.delete(`/api/genres/${this.state.movie.id}/${genre.id}`)
                    .then(response => {
                        if(!postRoute){
                            this.cancleChanges();
                        }
                    })
            });
        }
        
        if(postRoute){
            const data = this.state.genresToAdd.map(genre => {
                return {genreId: genre.id, movieId: this.state.movie.id}
            });
            axios.post('/api/genres/movie_genre', data)
                .then(response=>{
                    this.cancleChanges();
                })
        }
        if(!putRoute && !postRoute && !deleteRoute){
            this.cancleChanges();
        }
    }

    cancleChanges = () => {
        this.props.history.push(`/details/${this.props.match.params.id}`);
    }

    handleSelectGenreChange = (event) => {
        this.setState({
            genreToAdd: event.target.value
        });
    }

    removeFromGenresToAdd = genre => event => {
        let newGenresToAdd = this.state.genresToAdd;
        let i;
        for(i=0; i<this.state.genresToAdd.length; i++){
            if(this.state.genresToAdd[i].id === genre.id) break;
        }
        newGenresToAdd.splice(i, 1);
        this.setState({
            genresToAdd: newGenresToAdd
        });
    }

    addToGenresToAdd = event => {
        let i;
        const s = this.state;
        if(s.genreToAdd === ''){
            return;
        }
        const genre = s.genreToAdd;
        for(i = 0; i < s.genresToRemove.length; i++){
            if(s.genresToRemove[i].id === genre.id) break;
        }
        if(i === s.genresToRemove.length){
            this.setState({
                genresToAdd: [...s.genresToAdd, genre],
                genreToAdd: ''
            });
        } else {
            const newG = s.genresToRemove;
            newG.splice(i, 1);
            this.setState({
                genresToRemove: newG,
                genreToAdd: '',
                genres: [...s.genres, genre]
            });
        }
    }

    render(){
        const classes = this.props.classes;
        const state = this.state;
        if(this.state.title){
            return(
                <div className={classes.editCard}>
                    <div className={classes.row}>
                        <img src={state.poster}
                            alt={state.title}
                            className={classes.poster} />
                        <div className={classes.infoCard}>
                            <div>
                                <TextField
                                    onChange={this.handleTextInput('title')}
                                    value={state.title}
                                    label='title'
                                    className={classes.white}
                                    InputProps={{
                                        className: `${classes.white} ${classes.largeFont}`
                                    }}
                                    InputLabelProps={{
                                        className: classes.white
                                    }}
                                />
                            </div>
                            {state.genres.map((genre, i) => {
                                return (
                                    <Button key={i} className={classes.dangerButton}
                                    onClick={this.toggleGenre(genre)} variant="contained">
                                        {genre.name} <DeleteIcon className={classes.buttonIcon}/>
                                    </Button>
                                )
                            })}
                            {state.genresToAdd.map((genre, i) => {
                                return (
                                    <Button key={i} className={classes.dangerButton}
                                    onClick={this.removeFromGenresToAdd(genre)}>
                                        {genre.name} <DeleteIcon className={classes.buttonIcon}/>
                                    </Button>
                                )
                            }) }
                            <FormControl classes={{root: classes.selectGenre}}>
                                <InputLabel className={classes.white}>Select Genre </InputLabel>
                                <Select value={this.state.genreToAdd} className={classes.white}
                                onChange={this.handleSelectGenreChange}>
                                    {this.props.genres
                                        .map((genre, i) => {
                                            for(const g of this.state.genres){
                                                if(genre.id === g.id) return null;
                                            }
                                            for(const g of this.state.genresToAdd){
                                                if(genre.id === g.id) return null;
                                            }
                                            return <MenuItem key={i} value={genre}>{genre.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <Button variant="contained"
                                className={classes.button}
                                onClick={this.addToGenresToAdd}
                            >+</Button>
                            <TextField
                            onChange={this.handleTextInput('description')}
                            value={state.description}
                            label='description'
                            multiline
                            fullWidth={true}
                            className={classes.white}
                            InputProps={{
                                className: classes.white
                            }}
                            InputLabelProps={{
                                className: classes.white
                            }}
                            />
                            <Button className={classes.cancelButton}
                                variant="contained"
                                onClick={this.cancleChanges}
                                >Cancel</Button>
                            <Button
                                className={classes.saveButton}
                                variant="contained"
                                onClick={this.saveChanges}
                                >Save Changes <SaveIcon className={classes.buttonIcon} /></Button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return(
                <div className={classes.editCard}>
                    <p>Loading...</p>
                </div>
            )
        }
    }
}

export default withStyles((theme)=>({...MovieCardStyle(theme), ...EditPageStyle(theme) }))(
    withRouter(
        connect((r)=>({genres: r.genresReducer}))(EditPage)
    )
)