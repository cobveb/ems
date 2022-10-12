import * as constants from 'constants/uiNames';
import {isValidDate} from 'utils/';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'year', 'type'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.year){
        errors.year = isValidDate(values.year);
        if( props.plans.find(obj => {
             return ((new Date(obj.year).getFullYear() === new Date(values.year).getFullYear()) && obj.type === values.type && obj.id !== values.id)
            }) !== undefined){
                errors.year = constants.COORDINATOR_PLAN_EXISTS;
        }
    }
    return errors
}