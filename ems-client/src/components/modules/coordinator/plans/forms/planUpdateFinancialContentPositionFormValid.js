import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'costType', 'vat', 'amountAwardedGross',
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.costType){
        if(props.planPositions.find(obj => {
             return (obj.costType.code === values.costType.code && obj.id !== values.id)
            }) !== undefined){
                errors.costType = constants.COORDINATOR_PLAN_POSITION_PUBLIC_COST_TYPE_EXISTS;
        }
    }

    if(values.amountAwardedGross){
        let planValue = 0;
        props.planPositions.map(position => {
            if(position.id !== values.id){
                planValue += position.amountAwardedGross;
            }
            return position;
        })
        if(planValue + values.amountAwardedGross > props.correctedPlanValue){
            errors.amountAwardedGross = constants.COORDINATOR_PLAN_UPDATE_PLAN_AMOUNT_AWARDED_EXCEEDED;
        }
    }
    return errors
}