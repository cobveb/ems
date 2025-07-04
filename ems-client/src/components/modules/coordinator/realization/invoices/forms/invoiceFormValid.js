import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'number', 'sellDate', 'contractor'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.contract){
        if(values.contract !== undefined && values.contract !== null){
            if(values.contract.contractValueNet < (values.contract.realizedValueNet + values.invoiceValueNet)){
                errors["contract"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
            }
            if(values.contract.contractValueGross < (values.contract.realizedValueGross + values.invoiceValueGross)){
                errors["contract"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
            }
        }
        /*
            Validation or possible change of the contract in the invoice header. If the modified invoice has an
            option value, check if the new contract also has a declared option value
        */
        if(props.initialValues.contract !== null && props.initialValues.contract !== values.contract &&
            values.optionValueGross !== undefined && values.optionValueGross !== null && values.contract.optionValueGross === null){
            errors["contract"] = constants.COORDINATOR_REALIZATION_INVOICE_CONTRACT_OPTION_VALUE_NOT_EXISTS
        }

        /*
            Validation of whether it is possible to change the contract in the invoice header. If the modified invoice
            has an option value, check whether the new contract also has a declared option value and whether the option
            value for the new contract has not been exceeded after taking into account the current invoice
        */
        if(props.initialValues.contract !== null && props.initialValues.contract !== values.contract &&
            values.optionValueGross !== null && values.contract.optionValueGross !== null &&
                (values.contract.optionValueGross < values.optionValueGross + values.contract.realizedOptionValueGross)){
            errors["contract"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_OPTION_VALUE_EXCEEDED
        }
    }

    return errors;
}