import * as constants from 'constants/uiNames';

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
        if( props.plans.find(obj => {
             return ((new Date(obj.year).getFullYear() === new Date(values.year).getFullYear()) &&
                obj.type === values.type && obj.status.code !== 'AA' && obj.id !== values.id)
            }) !== undefined){
                errors.year = constants.COORDINATOR_PLAN_EXISTS;
        }
    }
    return errors
}