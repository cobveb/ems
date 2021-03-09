import * as constants from 'constants/uiNames';

export const validate =  ( values ) => {
    const errors = {}

    const requiredFields = [
        'name', 'quantity', 'unit', 'unitPrice'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })
    return errors
}