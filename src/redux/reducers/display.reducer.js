const displayReducer = (state = '', action) => {
    if(action.type === 'SET_DISPLAY'){
        return action.payload;
    }
    return state;
}

export default displayReducer;