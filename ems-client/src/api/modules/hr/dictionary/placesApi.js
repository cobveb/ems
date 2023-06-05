import Axios from 'axios';

class PlaceApi {
    static getAllPlaces(){
        return Axios.get(`/api/hr/dict/place/getAll`)
    }

    static savePlace(data){
        return Axios.put(`/api/hr/dict/place/savePlace`, data)
    }

    static deletePlace(placeId){
        return Axios.delete(`/api/hr/dict/place/deletePlace/${placeId}`)
    }

    static getActivePlaces(){
        return Axios.get(`/api/hr/dict/place/getActivePlaces`)
    }
}
export default PlaceApi;