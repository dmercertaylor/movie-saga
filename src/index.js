import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import axios from 'axios';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('GET_MOVIES', getMoviesSaga);
    yield takeEvery('GET_GENRES', getGenreSaga);
}

function getUrlQueries(url, queryObject){
    if(!queryObject) return url;
    const queries = Object.entries(queryObject);
    if(queries.length){
        url += `?${queries[0][0]}=${queries[0][1]}`;
        for(let i=1; i < queries.length; i++){
            const key = queries[i];
            url += `&${key[0]}=${key[1]}`;
        }
    }
    return url;
}

function* getMoviesSaga(action){
    try{
        const url = getUrlQueries('/api/movies', action.payload);
        const response = yield axios.get(url);
        yield put({ type: 'SET_MOVIES', payload: response.data });
        if(action.payload && action.payload.genre){
            yield put({type: 'SET_DISPLAY', payload: action.payload.genre });
        } else {
            yield put({type: 'SET_DISPLAY', payload: ''});
        }
    } catch(error){
        console.log(error);
    }
}

function* getGenreSaga(action){
    try{
        const url = getUrlQueries('/api/genres', action.payload);
        const response = yield axios.get(url);
        yield put({ type: 'SET_GENRES', payload: response.data });
    } catch (error) {
        console.log(error);
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server
const movies = (state = [], action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.payload;
        default:
            return state;
    }
}

// Used to store the movie genres
const genres = (state = [], action) => {
    switch (action.type) {
        case 'SET_GENRES':
            return action.payload;
        default:
            return state;
    }
}

const display = (state = '', action) => {
    if(action.type === 'SET_DISPLAY'){
        return action.payload;
    }
    return state;
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
        display
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={storeInstance}>
        <App />
    </Provider>
, document.getElementById('root'));
registerServiceWorker();
