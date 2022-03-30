import Axios from 'axios';

class ContractorApi {
    static getContractors(){
        return Axios.get(`/api/accountant/dictionary/contractors/getAll`)
    }

    static getActiveContractors(){
        return Axios.get(`/api/accountant/dictionary/contractors/getActive`)
    }

    static saveContractor(data){
        return Axios.put(`/api/accountant/dictionary/contractors/saveContractor`, data)
    }

    static deleteContractor(id){
        return Axios.delete(`/api/accountant/dictionary/contractors/deleteContractor/${id}`)
    }
}

export default ContractorApi;