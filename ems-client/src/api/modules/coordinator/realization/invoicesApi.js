import Axios from 'axios';

class InvoicesApi {

    static getInvoicesPageable(conditions){
        return Axios.post(`/api/coordinator/realization/invoice/getInvoicesPageable`, conditions)
    }

    static getInvoiceDetails(invoiceId){
        return Axios.get(`/api/coordinator/realization/invoice/${invoiceId}/getInvoiceDetails`)
    }

    static saveInvoice(action, data){
        return Axios.put(`/api/coordinator/realization/invoice/${action}/saveInvoice`, data)
    }

    static deleteInvoice(invoiceId){
        return Axios.delete(`/api/coordinator/realization/invoice/deleteInvoice/${invoiceId}`)
    }

    static getInvoicesPositionsByCoordinatorPlanPosition(planType, planPositionId){
        return Axios.get(`/api/coordinator/realization/invoice/planPosition/${planType}/${planPositionId}/getInvoicePositions`)
    }

    static saveInvoicePosition(invoiceId, action, data){
        return Axios.put(`/api/coordinator/realization/invoice/${invoiceId}/${action}/saveInvoicePosition`, data)
    }

    static deleteInvoicePosition(positionId){
        return Axios.delete(`/api/coordinator/realization/invoice/deleteInvoicePosition/${positionId}`)
    }

    static getPlanPositions(year, planType){
        return Axios.get(`/api/coordinator/realization/invoice/${year}/${planType}/getPlanPositions`)
    }

    static getInvoicesPositionsByInstitutionPlanPosition(planPositionId){
        return Axios.get(`/api/accountant/realization/invoice/planPosition/${planPositionId}/getInvoicePositions`)
    }

    static exportPlanPositionInvoicesPositionToExcel(exportType, positionId, data){
        return Axios.put(`/api/accountant/institution/plans/export/planPositionInvoicesPositions/${positionId}/${exportType}`, data, {responseType: 'blob'})
    }

    static exportInvoicesToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/coordinator/realization/invoice/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }
}

export default InvoicesApi;