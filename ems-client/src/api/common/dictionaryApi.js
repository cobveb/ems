import Axios from 'axios';

class DictionaryApi {
    static getDictionaries(){
        return Axios.get(`/api/dict/getAll`)
    }
}

export default DictionaryApi;