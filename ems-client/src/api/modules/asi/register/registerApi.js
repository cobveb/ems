import Axios from 'axios';

class RegisterApi {
    static getRegistersPositions(data){
        return Axios.post(`/api/asi/register/getRegistersPositions`, data)
    }

    static exportRegistersToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/asi/register/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }

}
export default RegisterApi;