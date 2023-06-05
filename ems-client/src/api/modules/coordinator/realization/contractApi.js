import Axios from 'axios';

class ContractApi {
    static getContracts(year){
        return Axios.get(`/api/coordinator/realization/contract/${year}/getContracts`)
    }

    static saveContract(action, data){
        return Axios.put(`/api/coordinator/realization/contract/${action}/saveContract`, data)
    }

    static deleteContract(contractId){
        return Axios.delete(`/api/coordinator/realization/contract/deleteContract/${contractId}`)
    }

    static getInvoices(contractId){
        return Axios.get(`/api/coordinator/realization/contract/${contractId}/getInvoices`)
    }
}
export default ContractApi;