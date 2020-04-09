import Axios from 'axios';

class ModuleApi {
    static getAllModules(){
        return Axios.get(`/api/modules`)
    }
}
export default ModuleApi;