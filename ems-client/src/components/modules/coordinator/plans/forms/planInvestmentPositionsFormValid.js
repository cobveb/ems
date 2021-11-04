import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'targetUnit', 'quantity'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.targetUnit){
        if( props.targetUnits.find(unit => {
             return (unit.targetUnit.code === values.targetUnit.code && unit.id !== values.id )
            }) !== undefined){
                errors.targetUnit = constants.COORDINATOR_PLAN_POSITION_INVESTMENT_TARGET_UNIT_EXISTS;
        }
    }

    return errors;
}