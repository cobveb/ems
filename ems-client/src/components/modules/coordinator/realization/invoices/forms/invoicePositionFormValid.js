import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'name', 'positionIncludedPlanType', 'amountNet', 'coordinatorPlanPosition'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.amountNet){
        if(props.invoice.contract !== undefined && props.invoice.contract !== null){
            if(props.invoice.contract.realPrevYearsValueNet !== null){
                if((props.invoice.contract.invoicesValueNet + props.invoice.contract.realPrevYearsValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                }
            } else {
                if((props.invoice.contract.invoicesValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                }
            }
        }
    }

    if(values.amountGross){
        if(values.amountNet !== undefined){
            if(values.amountNet > 0 && values.amountNet > values.amountGross){
                errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_VALUE_NET_INVALID
            } else if (values.amountNet < 0 && values.amountNet < values.amountGross){
                errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_VALUE_NET_INVALID
            }
        }
        if(props.invoice.contract !== undefined && props.invoice.contract !== null){
            if(props.invoice.contract.realPrevYearsValueGross !== null){
                if((props.invoice.contract.invoicesValueGross + props.invoice.contract.realPrevYearsValueGross + values.amountGross) > props.invoice.contract.contractValueGross){
                    errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                }
            } else {
                if((props.invoice.contract.invoicesValueGross + values.amountGross) > props.invoice.contract.contractValueGross){
                    errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                }
            }
        }
    }

    return errors;
}