import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'coordinatorPlanPosition', 'positionAmountNet', 'vat',
    ]

    requiredFields.forEach(field => {
        if(field === 'positionAmountNet'){
            if(values[field] !== 0){
                if(!values[field]){
                    errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    return errors
}