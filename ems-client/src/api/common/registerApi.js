import Axios from 'axios';

class RegisterApi {
    static getRegisters(){
        return Axios.get(`/api/register/getRegisters`)
    }

    static getRegisterPositions(code){
        return Axios.get(`/api/register/${code}/getPositions`)
    }

    static saveRegister(data){
        return Axios.put(`/api/register/saveRegister`, data)
    }

    static saveRegisterPosition(code, data){
        return Axios.put(`/api/register/${code}/saveRegisterPosition`, data)
    }

    static deleteRegisterPosition(code, positionId){
        return Axios.delete(`/api/register/${code}/deleteRegisterPosition/${positionId}`)
    }

    static getRegisterActivePositions(code){
        return Axios.get(`/api/register/${code}/getActivePositions`)
    }
}

export default RegisterApi;
