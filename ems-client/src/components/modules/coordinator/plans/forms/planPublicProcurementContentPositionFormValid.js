import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'assortmentGroup', 'orderType', 'vat', 'initiationTerm',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.assortmentGroup){
        if( props.planPositions.find(obj => {
             return (obj.assortmentGroup.code === values.assortmentGroup.code && obj.id !== values.id )
            }) !== undefined){
                errors.assortmentGroup = constants.COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP_EXISTS;
        }
    }
    return errors
}