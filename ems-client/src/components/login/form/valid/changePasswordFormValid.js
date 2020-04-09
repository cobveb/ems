import * as constants from 'constants/uiNames';

export const validate = values => {
    const errors = {}
    const requiredFields = [
        'oldPassword',
        'newPassword',
        'reNewPassword'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if (values.reNewPassword !== values.newPassword){
        errors.reNewPassword = constants.FORM_ERROR_MSG_INVALID_RENEW_PASSWORD;
    }

    if (values.oldPassword === values.newPassword){
        errors.newPassword = constants.FORM_ERROR_MSG_EQUAL_NEW_PASSWORD;
    }

    return errors
}
