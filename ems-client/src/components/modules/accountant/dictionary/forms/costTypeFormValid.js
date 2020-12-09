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
        if( (props.allCosts.find(cost => cost.code === values.code) !== undefined) && props.action === "add" ){
            errors.code = constants.ACCOUNTANT_COST_TYPE_CODE_EXISTS;
        }
    }

    return errors
}