import * as constants from 'constants/uiNames';

export const validate =  ( values ) => {
    const errors = {}

    const requiredFields = [
        'number', 'sellDate', 'contractor'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    return errors;
}