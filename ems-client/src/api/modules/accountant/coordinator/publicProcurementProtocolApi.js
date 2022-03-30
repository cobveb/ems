import Axios from 'axios';

class PublicProcurementProtocolApi {
    static getProtocols(){
        return Axios.get(`/api/accountant/coordinator/publicProcurement/protocol/getAllProtocols`)
    }

    static approveProtocol(protocolId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/protocols/protocol/approve/${protocolId}`)
    }

    static sendBackProtocol(protocolId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/protocol/protocol/sendBack/${protocolId}`)
    }
}

export default PublicProcurementProtocolApi;