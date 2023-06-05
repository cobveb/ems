import Axios from 'axios';

class PublicProcurementProtocolApi {
    static getProtocols(year){
        return Axios.get(`/api/accountant/coordinator/publicProcurement/protocol/${year}/getAllProtocols`)
    }

    static approveProtocol(protocolId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/protocols/protocol/approve/${protocolId}`)
    }

    static sendBackProtocol(protocolId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/protocol/protocol/sendBack/${protocolId}`)
    }
}

export default PublicProcurementProtocolApi;