import Axios from 'axios';

class ApplicationsApi {
    static getApplications(){
        return Axios.get(`/api/application/applicant/getApplications`)
    }

    static getApplicationPositions(applicationId){
        return Axios.get(`/api/application/${applicationId}/getPositions`)
    }

    static saveApplication(action, data){
        return Axios.put(`/api/application/${action}/saveApplication`, data)
    }

    static sendApplication(applicationId){
        return Axios.put(`/api/application/applicant/send/${applicationId}`)
    }

    static withdrawApplication(applicationId){
        return Axios.put(`/api/application/applicant/withdraw/${applicationId}`)
    }

    static deleteApplication(applicationId){
        return Axios.delete(`/api/application/applicant/deleteApplication/${applicationId}`)
    }

}

export default ApplicationsApi;