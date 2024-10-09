import Axios from 'axios';

class InvoiceApi {

    static getInvoicesPageable(conditions){
        return Axios.post(`/api/accountant/realization/invoice/getInvoicesPageable`, conditions)
    }

    static exportInvoicesToExcel(exportType, headRows, searchConditions){
        return Axios.put(`/api/accountant/realization/invoice/export/${exportType}`, {headRows, searchConditions}, {responseType: 'blob'})
    }
}

export default InvoiceApi;