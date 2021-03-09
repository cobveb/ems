import * as constants from 'constants/uiNames';
import {isValidEuroExchangeRate} from 'utils/';

export const validate =  ( values ) => {
    const errors = {}
    const requiredFields = [
        'name', 'mode', 'estimationType', 'amountNet', 'euroExchangeRate'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.euroExchangeRate){
        errors.euroExchangeRate = isValidEuroExchangeRate(values.euroExchangeRate);
    }

    return errors
}