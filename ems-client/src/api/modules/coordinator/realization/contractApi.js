import Axios from 'axios';

class ContractApi {

    static getContracts(conditions){
        return Axios.post(`/api/coordinator/realization/contract/getContracts`, conditions)
    }

    static getContractDetails(contractId){
        return Axios.get(`/api/coordinator/realization/contract/${contractId}/getContractDetails`)
    }

    static getContractsDictionary(conditions){
        return Axios.post(`/api/coordinator/realization/contract/getContractsDictionary`, conditions)
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

    static exportContractsToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/coordinator/realization/contract/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }
}
export default ContractApi;