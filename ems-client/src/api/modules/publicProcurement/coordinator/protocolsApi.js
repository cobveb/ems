import Axios from 'axios';

class ProtocolsApi {
    static getProtocols(year){
        return Axios.get(`/api/public/coordinator/publicProcurement/protocol/${year}/getAllProtocols`)
    }

    static approveProtocol(protocolId){
        return Axios.put(`/api/public/coordinator/publicProcurement/protocol/approveProtocol/${protocolId}`)
    }

    static sendBackProtocol(protocolId){
        return Axios.put(`/api/public/coordinator/publicProcurement/protocol/sendBackProtocol/${protocolId}`)
    }
}

export default ProtocolsApi;