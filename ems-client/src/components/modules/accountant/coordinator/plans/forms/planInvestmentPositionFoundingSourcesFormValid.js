import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'sourceAmountAwardedGross', 'sourceExpensesPlanAwardedGross'
    ]

    requiredFields.forEach(field => {

        if(values[field] !== 0){
            if (!values[field]) {
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        }
    })

    console.log(values)
    if(values.sourceAmountAwardedGross || values.sourceExpensesPlanAwardedGross){
        console.log(values.sourceAmountAwardedGross)
        console.log(values.sourceExpensesPlanAwardedGross)
        if(values.sourceExpensesPlanAwardedGross > values.sourceAmountAwardedGross)
            errors.sourceExpensesPlanAwardedGross = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_EXPENSES_PLAN_GROSS;
    }


    return errors
}