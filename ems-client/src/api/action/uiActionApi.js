import Axios from 'axios';

class UiActionApi {
    static getEuroExchangeRate(){
        return Axios.get(`/api/param/getParam/kursEuro`)
    }
}

export default UiActionApi;