import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';

// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';

// Import reducers
import displayReducer from './redux/reducers/display.reducer';
import genresReducer from './redux/reducers/genres.reducer';
import moviesReducer from './redux/reducers/movies.reducer';

// Import sagas
import getMoviesSaga from './redux/sagas/getMovies.saga';
import getGenreSaga from './redux/sagas/getGenre.saga';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('GET_MOVIES', getMoviesSaga);
    yield takeEvery('GET_GENRES', getGenreSaga);
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        moviesReducer,
        genresReducer,
        displayReducer
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
