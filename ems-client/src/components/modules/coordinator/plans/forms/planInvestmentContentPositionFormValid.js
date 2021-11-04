import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'task', 'category', 'realizationDate', 'vat'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.realizationDate){
        if(new Date(values.realizationDate).getFullYear() !== new Date(props.planYear).getFullYear()){
            errors.realizationDate = constants.COORDINATOR_PLAN_POSITION_INVESTMENT_REALIZATION_DATE_INVALID;
        }
    }

    return errors;
}