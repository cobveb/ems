import Axios from 'axios';

class DictionaryApi {
    static getDictionaries(){
        return Axios.get(`/api/dict/getAll`)
    }

    static getDictionary(code){
        return Axios.get(`/api/dict/getDict/${code}`)
    }

    static getDictionaryByModule(module){
        return Axios.get(`/api/dict/getDictModule/${module}`)
    }

    static saveDictionaryItem(dictCode, data){
        console.log(dictCode)
        return Axios.put(`/api/dict/${dictCode}/saveDictItem`, data)
    }

    static deleteDictionaryItem(itemId){
        return Axios.delete(`/api/dict/deleteItem/${itemId}`)
    }
}

export default DictionaryApi;