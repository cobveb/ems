import * as constants from 'constants/uiNames';

export const validate = (values, props) => {
    const errors = {}
    const requiredFields = [
        'code',
        'name',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.code){
        if( props.positions.find(position => {
             return (position.code === values.code && position.id !== values.id)
            }) !== undefined){
                errors.code = constants.DICTIONARY_ITEM_CODE_EXISTS;
        }
    }
    return errors
}