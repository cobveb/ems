import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'type', 'sourceAmountRequestedNet', 'sourceExpensesPlanNet'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }

//        if(values.type){
//            if(props.positions.find(position =>{
//                return (position.type.code === values.type.code) })  !== undefined){
//                    errors.type = constants.ACCOUNTANT_COST_TYPE_YEAR_EXISTS;
//                }
//        }
//
//        if(values.sourceExpensesPlanNet ){
//            errors.sourceExpensesPlanNet = "nie ma szans";
//        }


    })


    return errors
}