import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'value', 'name'
    ]
    requiredFields.forEach(field => {
        // Allow 0 to value criterion
        if (field === "value"){
            if(values["value"] !== 0){
                if(!values[field] ){
                    errors.value = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.value){
        if( values.value > 100){
                errors.value = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_VALUE;
        } else {
            const curCriteriaValue = props.criteria.reduce((prev, cur) => prev + cur.value, 0)
            console.log(curCriteriaValue)
            console.log(values.value)
            console.log(props.initialValues.value)
            if(props.action === 'add'){
                if( curCriteriaValue + values.value > 100){
                    errors.value = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_COUNT_VALUE;
                }
            } else {
                if( curCriteriaValue + values.value - props.initialValues.value > 100){
                    errors.value = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_COUNT_VALUE;
                }
            }
        }
    }
    return errors
}