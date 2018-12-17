const getLocationReducer = (state = {selectedLocation: null}, action) => {
    switch(action.type) {
        case 'GET_LOCATION':
        return {...state, selectedLocation : action.payload}
        default :
            return state
    }
}
export default getLocationReducer