import * as constants from 'constants/uiNames';
import {isValidDate} from 'utils/';

export const validate =  ( values ) => {
    const errors = {}

    const requiredFields = [
        'sourceYear', 'targetYear'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.sourceYear) {
        errors.sourceYear = isValidDate(values.sourceYear);
        if(new Date(values.sourceYear).getFullYear() === new Date(values.targetYear).getFullYear()){
            errors["sourceYear"] = constants.ACCOUNTANT_COST_TYPE_GENERATOR_SOURCE_TARGET_YEAR_EQUAL
        }
    }

    if(values.targetYear) {
        errors.targetYear = isValidDate(values.targetYear);
        if(values.sourceYear === values.targetYear){
            errors["sourceYear"] = constants.ACCOUNTANT_COST_TYPE_GENERATOR_SOURCE_TARGET_YEAR_EQUAL
        }
    }

    return errors;
}