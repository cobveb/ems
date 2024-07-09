import Axios from 'axios';

class EntitlementSystemApi {
    static getEntitlementSystems(){
        return Axios.get(`/api/asi/dict/employee/entitlementSystem/getEntitlementSystems`)
    }

    static getEntitlementSystemsByRegister(){
        return Axios.get(`/api/asi/dict/employee/entitlementSystem/getEntitlementSystemsByRegister`)
    }

    static getActiveEntitlementSystems(){
        return Axios.get(`/api/asi/dict/employee/entitlementSystem/getActiveEntitlementSystems`)
    }

    static getActiveUnassignedEntitlementSystems(){
        return Axios.get(`/api/asi/dict/employee/entitlementSystem/getActiveUnassignedEntitlementSystems`)
    }

    static saveEntitlementSystem(data){
        return Axios.put(`/api/asi/dict/employee/entitlementSystem/saveEntitlementSystem`, data)
    }

    static deleteEntitlementSystem(systemId){
        return Axios.delete(`/api/asi/dict/employee/entitlementSystem/${systemId}/deleteEntitlementSystem`)
    }

    static saveEntitlementSystemPermission(systemId, data){
        return Axios.put(`/api/asi/dict/employee/entitlementSystem/${systemId}/saveEntitlementSystemPermission`, data)
    }

    static deleteEntitlementSystemPermission(systemId, permissionId){
        return Axios.delete(`/api/asi/dict/employee/entitlementSystem/${systemId}/${permissionId}/deleteEntitlementSystemPermission`)
    }

    static getEntitlementSystemPermissions(systemId){
        return Axios.get(`/api/asi/dict/employee/entitlementSystem/${systemId}/getEntitlementSystemPermissions`)
    }

}
export default EntitlementSystemApi;