import axios from 'axios';
import { put } from 'redux-saga/effects';

import getUrlQueries from './modules/getUrlQueries';

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

export default getMoviesSaga;