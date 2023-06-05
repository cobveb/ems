import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'surname', 'name'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
        }
    })

    return errors
}