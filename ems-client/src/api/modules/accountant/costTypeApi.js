import Axios from 'axios';

class CostTypeApi {

    static getCostTypeAll(){
        return Axios.get(`/api/accountant/costType/getAll`)
    }

    static getYearsByCostType(costId){
        return Axios.get(`/api/accountant/costType/getYears/${costId}`)
    }

    static getCostTypeByCoordinatorAndYear(year, coordinatorCode){
        return Axios.get(`/api/accountant/costType/getByCoordinator/${year}/${coordinatorCode}`)
    }

    static saveCostType(data){
        return Axios.put(`/api/accountant/costType/saveCostType`, data)
    }

    static deleteCostType(costId){
        return Axios.delete(`/api/accountant/costType/deleteCostType/${costId}`)
    }
    
    static deleteCostTypeYear(yearId){
        return Axios.delete(`/api/accountant/costType/deleteCostTypeYear/${yearId}`)
    }

    static exportExportCostTypesToExcel(exportType, data){
        return Axios.put(`/api/accountant/costType/export/costTypes/${exportType}`, data, {responseType: 'blob'})
    }

    static exportExportCostTypeYearsToExcel(exportType, costId, data){
        return Axios.put(`/api/accountant/costType/export/costTypeYears/${costId}/${exportType}`, data, {responseType: 'blob'})
    }

    static generateCostsTypes(sourceYear, targetYear){
        return Axios.post(`/api/accountant/costType/generateCostsTypes?sourceYear=${sourceYear}&targetYear=${targetYear}`)
    }
}

export default CostTypeApi;