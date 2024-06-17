import Axios from 'axios';

class EntitlementApi {
    static getEntitlements(employeeId){
        return Axios.get(`/api/asi/employee/${employeeId}/entitlement/getEntitlements`)
    }

    static saveEntitlement(employeeId, data){
        return Axios.put(`/api/asi/employee/${employeeId}/entitlement/saveEntitlement`, data)
    }

    static deleteEntitlement(employeeId, entitlementId){
        return Axios.delete(`/api/asi/employee/${employeeId}/entitlement/${entitlementId}/deleteEntitlement`)
    }

    static saveEntitlementPermission(employeeId, entitlementId, data){
        return Axios.put(`/api/asi/employee/${employeeId}/entitlement/${entitlementId}/saveEntitlementPermission`, data)
    }

    static deleteEntitlementPermission(employeeId, entitlementId, permissionId){
        return Axios.delete(`/api/asi/employee/${employeeId}/entitlement/${entitlementId}/${permissionId}/deleteEntitlementPermission`)
    }

    static getEntitlementDetails(employeeId, entitlementId){
        return Axios.get(`/api/asi/employee/${employeeId}/entitlement/${entitlementId}/getEntitlementDetails`)
    }
}
export default EntitlementApi;