import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'applicationProcurementPlanPosition', 'orderGroupValueNet', 'vat', 'optionValue',
    ]

    requiredFields.forEach(field => {
        if(field === "optionValue"){
            if(!values.optionValue && values.isOption){
                errors["optionValue"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.applicationProcurementPlanPosition){
        if( props.assortmentGroups.find(obj => {
             return (obj.applicationProcurementPlanPosition.code === values.applicationProcurementPlanPosition.code &&  obj.vat === values.vat && obj.id !== values.id)
            }) !== undefined){
                errors.applicationProcurementPlanPosition = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_EXISTS;
        }
    }

    if(values.orderGroupValueNet && values.applicationProcurementPlanPosition !== undefined){
        if(props.applicationMode.code === 'PL'){
            if(values.applicationProcurementPlanPosition.amountRequestedNet < values.orderGroupValueNet){
                errors.orderGroupValueNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_REQUESTED_INVALID;
            } else if ((values.applicationProcurementPlanPosition.amountRequestedNet - (values.applicationProcurementPlanPosition.amountInferredNet + values.applicationProcurementPlanPosition.amountRealizedNet)) < values.orderGroupValueNet){
                errors.orderGroupValueNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_INVALID;
            }
        }
    }

    if(values.orderValueYearNet && values.orderGroupValueNet !== undefined){
        if(values.orderGroupValueNet < values.orderValueYearNet){
            errors.orderValueYearNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_YEAR_REQUESTED_INVALID;
        }
    }

    if(values.optionValue){
        if( values.optionValue > 100){
                errors.optionValue = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_VALUE;
        }
    }

    if(values.applicationAssortmentGroupPlanPositions !== undefined && values.applicationAssortmentGroupPlanPositions.length === 0){
        errors["planPositions"] = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ARRAY_FIELD_REQUIRE
    }

    return errors
}