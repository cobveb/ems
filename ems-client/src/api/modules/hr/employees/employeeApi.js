import Axios from 'axios';

class EmployeeApi {
    static getEmployees(){
        return Axios.get(`/api/hr/employees/employee/getEmployees`)
    }

    static saveEmployee(data){
        return Axios.put(`/api/hr/employees/employee/saveEmployee`, data)
    }

    static deleteEmployee(employeeId){
        return Axios.delete(`/api/hr/employees/employee/${employeeId}/deleteEmployee`)
    }
}
export default EmployeeApi;