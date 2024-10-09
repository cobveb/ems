import Axios from 'axios';

class ContractApi {
    static getContracts(conditions){
        return Axios.post(`/api/accountant/realization/contract/getContracts`, conditions)
    }

    static exportContractsToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/accountant/realization/contract/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }
}

export default ContractApi;