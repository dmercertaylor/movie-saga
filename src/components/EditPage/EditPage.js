import React, {Component, useState} from 'react';
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
import Modal from '@material-ui/core/Modal';

class EditPage extends Component{
    state = {
        titleDidChange: false,
        descriptionDidChange: false,
        movie: {id: this.props.match.params.id},
        genres: [],
        genresToAdd: [],
        genresToRemove: [],
        genreToAdd: '',
        addGenreModalOpen: false
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
        this.props.dispatch({type: 'GET_GENRES'});
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

        // Define which routes I'll be making requests to.
        let putRoute = (this.state.descriptionDidChange || this.state.titleDidChange);
        let deleteRoute = (this.state.genresToRemove.length > 0);
        let postRoute = (this.state.genresToAdd.length > 0)

        if(putRoute){
            axios.put(`/api/movies/${this.state.id}`, data)
                .then(response => {
                    // Check if other async things are happening
                    if(!deleteRoute && !postRoute){
                        this.cancleChanges();
                    }
                });
        }

        if(deleteRoute){
            this.state.genresToRemove.forEach(genre => {
                axios.delete(`/api/genres/${this.state.movie.id}/${genre.id}`)
                    .then(response => {
                        // Check if other async things are happening
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
        if(event.target.value === 'Add New'){
            event.stopPropagation();
            this.setState({
                genreToAdd: '',
                addGenreModalOpen: true
            });
        } else {
            this.setState({
                genreToAdd: event.target.value
            });
        }
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

        let genre;
        for(const g of this.props.genres){
            if(s.genreToAdd === g.name){
                genre = g;
                break;
            }
        }

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

    getNewGenreFromModal = genre => {
        this.props.dispatch({type: 'GET_GENRES'});
        this.setState({
            addGenreModalOpen: false,
            genresToAdd: [...this.state.genresToAdd, genre]
        });
    }

    render(){
        const classes = this.props.classes;
        const state = this.state;
        if(this.state.title){
            const titleInput = (
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
            )
            const genresDisplay = (
                state.genres.map((genre, i) => {
                    return (
                        <Button key={i} className={classes.dangerButton}
                        onClick={this.toggleGenre(genre)} variant="contained">
                            {genre.name} <DeleteIcon className={classes.buttonIcon}/>
                        </Button>
                    )
                }).concat(
                    state.genresToAdd.map((genre, i) => (
                        <Button key={genre.id} className={classes.dangerButton}
                        onClick={this.removeFromGenresToAdd(genre)}>
                            {genre.name} <DeleteIcon className={classes.buttonIcon}/>
                        </Button>
                    ))
                )
            );

            const genresSection = (
                <div className={classes.addGenreSection}>
                    {genresDisplay}
                    <FormControl classes={{root: classes.selectGenre}}>
                        <InputLabel className={classes.white}>Select Genre </InputLabel>
                        <Select native value={this.state.genreToAdd} className={classes.white}
                        onChange={this.handleSelectGenreChange}>
                            <option value={''}></option>
                            {this.props.genres
                                .map((genre, i) => {
                                    for(const g of this.state.genres){
                                        if(genre.id === g.id) return null;
                                    }
                                    for(const g of this.state.genresToAdd){
                                        if(genre.id === g.id) return null;
                                    }
                                    return <option key={genre.id} value={genre.name}>{genre.name}</option>
                            })}
                            <option value={'Add New'}>Add New...</option>
                        </Select>
                    </FormControl>
                    <Button variant="contained"
                    className={classes.button}
                    onClick={this.addToGenresToAdd}
                    >+</Button>
                </div>
            );
                            
            const descriptionInput = (
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
            );
            
            // RETURN
            return(
                <div className={classes.editCard}>
                    <AddGenreModal
                        open={state.addGenreModalOpen}
                        cancle={(e)=>{e.preventDefault(); this.setState({addGenreModalOpen: false})}}
                        classes={classes}
                        returnNewGenre={this.getNewGenreFromModal}
                    />
                    <div className={classes.row}>
                        <img src={state.poster}
                            alt={state.title}
                            className={classes.poster}
                        />
                        <div className={classes.infoCard}>
                            {titleInput}
                            {genresSection}
                            {descriptionInput}
                            <Button className={classes.cancelButton}
                                variant="contained"
                                onClick={this.cancleChanges}
                            >
                                Cancel
                            </Button>
                            <Button
                                className={classes.saveButton}
                                variant="contained"
                                onClick={this.saveChanges}
                            >
                                Save Changes
                                <SaveIcon className={classes.buttonIcon} />
                            </Button>
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

function AddGenreModal(props){
    const classes = props.classes;
    const [genre, setGenre] = useState('');

    const handleTextInput = event => {
        const newChar = event.target.value[event.target.value.length - 1];
        if(/[a-zA-Z\-\s]/.test(newChar)){
            setGenre(event.target.value);
        }
    }

    const addGenre = e => {
        axios.post('/api/genres/', {genre: genre})
            .then(responseOne => {
                axios.get(`/api/genres/get_id/${genre}`)
                    .then(responseTwo => {
                        console.log(responseTwo);
                        setGenre('');
                        props.returnNewGenre({name: genre, id: responseTwo.data[0].id});
                    })
            }).catch(err => console.log(err));
    }

    return (
        <Modal open={props.open} className={classes.modal}>
            <div className={classes.modalDiv}>
                <h2>New Genre:</h2>
                <form onSubmit={addGenre}>
                    <div>
                        <TextField
                            onChange={handleTextInput}
                            value={genre}
                            autoFocus
                            className={classes.white}
                            inputProps={{
                                style: { textAlign: "center" }
                            }}
                            InputProps={{
                                className: classes.modalTextField,
                            }}
                            InputLabelProps={{
                                style: {textAlign: 'center'},
                                className: classes.modalTextField
                            }}
                        />
                    </div>
                    <div className={classes.modalButtonDiv}>
                        <Button
                            className={classes.saveButton}
                            variant="contained"
                            type='submit'
                        >
                            Add Genre
                        </Button>
                        <Button className={classes.cancelButton}
                            variant="contained"
                            onClick={props.cancle}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default withStyles((theme)=>({...MovieCardStyle(theme), ...EditPageStyle(theme) }))(
    withRouter(
        connect((r)=>({genres: r.genresReducer}))(EditPage)
    )
)