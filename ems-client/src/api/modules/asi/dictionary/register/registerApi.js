import Axios from 'axios';

class RegisterApi {
    static getRegisters(data){
        return Axios.post(`/api/asi/dict/register/getRegisters`, data)
    }

    static getActiveRegisters(){
        return Axios.get(`/api/asi/dict/register/getActiveRegisters`)
    }

    static saveRegister(data){
        return Axios.put(`/api/asi/dict/register/saveRegister`, data)
    }

    static deleteRegister(registerId){
        return Axios.delete(`/api/asi/dict/register/${registerId}/deleteRegister`)
    }

    static addRegisterEntitlementSystems(registerId, data){
        return Axios.put(`/api/asi/dict/register/${registerId}/addRegisterEntitlementSystems`, data)
    }

    static removeRegisterEntitlementSystem(registerId, systemId){
        return Axios.post(`/api/asi/dict/register/${registerId}/${systemId}/removeRegisterEntitlementSystem`)
    }

    static getRegisterEntitlementSystem(registerId){
        return Axios.get(`/api/asi/dict/register/${registerId}/getRegisterEntitlementSystem`)
    }

    static exportRegistersToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/asi/dict/register/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }

}
export default RegisterApi;