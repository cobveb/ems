import * as constants from 'constants/uiNames';

export const validate = values => {
    const errors = {}
    const requiredFields = [
        'name',
        'surname',
        'username',
        'unit',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }

        if (values.unit){ // Value unit is object
            if(values.unit.code.length === 0){
                errors.unit = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        }
    })
    return errors
}