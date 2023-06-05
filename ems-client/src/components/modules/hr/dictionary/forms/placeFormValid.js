import * as constants from 'constants/uiNames';


export const validate = (values, props) => {
    const errors = {};
    const requiredFields = ['name'];

    if(values.type !== undefined && values.type === 'WP'){
        requiredFields.push('group');
    } else {
        requiredFields.push('location');
    }

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.name){
        if( props.positions.find(position => {
             return (position.name === values.name && position.id !== values.id)
            }) !== undefined){
                errors.name = constants.DICTIONARY_ITEM_NAME_EXISTS;
        }
    }
    return errors
}