import Axios from 'axios';

class PlansApi{
    static getPlans(){
        return Axios.get(`/api/public/institution/plans/getPlans`)
    }
}
export default PlansApi;