import axios from 'axios';
import { put } from 'redux-saga/effects';

import getUrlQueries from './modules/getUrlQueries';

function* getGenreSaga(action){
    try{
        const url = getUrlQueries('/api/genres', action.payload);
        const response = yield axios.get(url);
        yield put({ type: 'SET_GENRES', payload: response.data });
    } catch (error) {
        console.log(error);
    }
}

export default getGenreSaga;