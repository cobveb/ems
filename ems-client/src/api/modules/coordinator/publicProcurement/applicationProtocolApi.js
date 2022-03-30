import Axios from 'axios';

class ApplicationProtocolApi {
    static getProtocolByApplication(applicationId){
        return Axios.get(`/api/coordinator/publicProcurement/protocol/getProtocolByApplication/${applicationId}`)
    }

    static saveProtocol(data){
        return Axios.put(`/api/coordinator/publicProcurement/protocol/save`, data)
    }

    static saveProtocolByApplication(data, applicationId){
        return Axios.put(`/api/coordinator/publicProcurement/protocol/saveByApplication/${applicationId}`, data)
    }

    static deleteProtocol(id){
        return Axios.delete(`/api/coordinator/publicProcurement/protocol/deleteProtocol/${id}`)
    }

    static deleteProtocolPrice(protocolId, priceId){
        return Axios.delete(`/api/coordinator/publicProcurement/protocol/${protocolId}/deleteProtocolPrice/${priceId}`)
    }

    static sendProtocol(protocolId){
        return Axios.put(`/api/coordinator/publicProcurement/protocol/sendProtocol/${protocolId}`)
    }

    static approvePublic(protocolId){

        return Axios.put(`/api/public/coordinator/publicProcurement/protocol/approveProtocol/${protocolId}`)
    }

    static approveAccountant(protocolId){
        return Axios.put(`/api/accountant/coordinator/publicProcurement/protocol/approveProtocol/${protocolId}`)
    }

    static approveChief(protocolId){
        return Axios.put(`/api/director/coordinator/publicProcurement/protocol/approveProtocol/${protocolId}`)
    }

    static sendBackProtocol(protocolId){
        return Axios.put(`/api/public/publicProcurement/protocol/sendBackProtocol/${protocolId}`)
    }

    static printProtocol(protocolId){
        return Axios.get(`/api/coordinator/publicProcurement/protocol/print/${protocolId}`, {responseType: 'blob'})
    }

}

export default ApplicationProtocolApi;