import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'applicationProcurementPlanPosition', 'orderGroupValueNet', 'orderValueYearNet', 'vat'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.applicationProcurementPlanPosition){
        if( props.assortmentGroups.find(obj => {
             return (obj.applicationProcurementPlanPosition.code === values.applicationProcurementPlanPosition.code && obj.id !== values.id)
            }) !== undefined){
                errors.applicationProcurementPlanPosition = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_EXISTS;
        }
    }

    if(values.orderGroupValueNet && values.applicationProcurementPlanPosition !== undefined){
        if(values.applicationProcurementPlanPosition.amountRequestedNet < values.orderGroupValueNet){
            errors.orderGroupValueNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_REQUESTED_INVALID;
        } else if ((values.applicationProcurementPlanPosition.amountRequestedNet - (values.applicationProcurementPlanPosition.amountInferredNet + values.applicationProcurementPlanPosition.amountRealizedNet)) < values.orderGroupValueNet){
            errors.orderGroupValueNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_INVALID;
        }
    }

    if(values.orderValueYearNet && values.orderGroupValueNet !== undefined){
        if(values.orderGroupValueNet < values.orderValueYearNet){
            errors.orderValueYearNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_YEAR_REQUESTED_INVALID;
        }
    }

    return errors
}