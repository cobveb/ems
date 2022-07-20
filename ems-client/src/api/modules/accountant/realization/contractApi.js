import Axios from 'axios';

class ContractApi {
    static getContracts(year){
        return Axios.get(`/api/accountant/realization/contract/${year}/getContracts`)
    }
}

export default ContractApi;