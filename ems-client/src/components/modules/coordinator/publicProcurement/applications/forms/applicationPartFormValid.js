import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'name', 'amountNet', 'vat'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.amountNet){
        if( values.amountNet > props.orderValueNet){
                errors.amountNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_INVALID_VALUE_NET;
        } else {
            const curPartsValue = props.parts.reduce((prev, cur) => prev + cur.amountNet, 0)
            if(props.action === 'add'){
                if( curPartsValue + values.amountNet > props.orderValueNet){
                    errors.amountNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_INVALID_COUNT_VALUE_NET;
                }
            } else {
                if( curPartsValue + values.amountNet - props.initialValues.amountNet > props.orderValueNet){
                    errors.amountNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_INVALID_COUNT_VALUE_NET;
                }
            }
        }
    }
    return errors
}