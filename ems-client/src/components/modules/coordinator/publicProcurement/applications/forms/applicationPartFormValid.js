import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'name', 'amountNet', 'vat', 'reasonNotRealized', 'amountContractAwardedNet', 'optionValue'
    ]
    requiredFields.forEach(field => {
        if(field === "reasonNotRealized"){
            if(!values.reasonNotRealized && !values.isRealized){
                errors["reasonNotRealized"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
            }
        } else if(field === "amountContractAwardedNet"){
            if(!values.amountContractAwardedNet && values.isRealized){
                errors["amountContractAwardedNet"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
            }
        } else if(field === "optionValue"){
            if(!values.optionValue && values.isOption){
                errors["optionValue"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
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

    if(values.optionValue){
        if( values.optionValue > 100){
                errors.optionValue = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_VALUE;
        } else {
            const curOptionValue = props.parts.reduce((prev, cur) => prev + cur.value, 0)
            if(props.action === 'add'){
                if( curOptionValue + values.optionValue > 100){
                    errors.optionValue = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_COUNT_VALUE;
                }
            } else {
                if( curOptionValue + values.optionValue - props.initialValues.optionValue > 100){
                    errors.curOptionValue = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_COUNT_VALUE;
                }
            }
        }
    }

    return errors
}