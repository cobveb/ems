import Axios from 'axios';

class DictionaryApi {
    static getDictionaries(){
        return Axios.get(`/api/dict/getAll`)
    }

    static getDictionary(code){
        return Axios.get(`/api/dict/getDict/${code}`)
    }
}

export default DictionaryApi;