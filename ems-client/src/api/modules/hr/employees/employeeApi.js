import Axios from 'axios';

class EmployeeApi {

    static getEmployeesPageable(data){
        return Axios.post(`/api/hr/employees/employee/getEmployeesPageable`, data)
    }

    static saveEmployee(data){
        return Axios.put(`/api/hr/employees/employee/saveEmployee`, data)
    }

    static deleteEmployee(employeeId){
        return Axios.delete(`/api/hr/employees/employee/${employeeId}/deleteEmployee`)
    }

    static exportEmployeesToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/hr/employees/employee/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }

}
export default EmployeeApi;