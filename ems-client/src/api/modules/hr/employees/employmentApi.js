import Axios from 'axios';

class EmploymentApi {
    static getEmployments(employeeId){
        return Axios.get(`/api/hr/employees/employee/${employeeId}/employment/getEmployments`)
    }

    static getActiveEmployments(employeeId){
        return Axios.get(`/api/hr/employees/employee/${employeeId}/employment/getActiveEmployments`)
    }

    static saveEmployment(employeeId, data){
        return Axios.put(`/api/hr/employees/employee/${employeeId}/employment/saveEmployment`, data)
    }

    static deleteEmployment(employeeId, employmentId){
        return Axios.delete(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/deleteEmployment`)
    }

    static getEmploymentStatements(employeeId, employmentId){
        return Axios.get(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/statement/getStatements`)
    }

    static saveEmploymentStatement(employeeId, employmentId, data){
        return Axios.put(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/statement/saveStatement`, data)
    }

    static deleteEmploymentStatement(employeeId, employmentId, statementId){
        return Axios.delete(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/statement/${statementId}/deleteStatement`)
    }

    static getEmploymentAuthorizations(employeeId, employmentId){
        return Axios.get(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/authorization/getAuthorizations`)
    }

    static saveEmploymentAuthorization(employeeId, employmentId, data){
        return Axios.put(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/authorization/saveAuthorization`, data)
    }

    static deleteEmploymentAuthorization(employeeId, employmentId, authorizationId){
        return Axios.delete(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/authorization/${authorizationId}/deleteAuthorization`)
    }

    static getEmploymentWorkplaces(employeeId, employmentId){
        return Axios.get(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/workplace/getWorkplaces`)
    }

    static saveEmploymentWorkplace(employeeId, employmentId, data){
        return Axios.put(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/workplace/saveWorkplace`, data)
    }

    static deleteEmploymentWorkplace(employeeId, employmentId, workplaceId){
        return Axios.delete(`/api/hr/employees/employee/${employeeId}/employment/${employmentId}/workplace/${workplaceId}/deleteWorkplace`)
    }
}
export default EmploymentApi;