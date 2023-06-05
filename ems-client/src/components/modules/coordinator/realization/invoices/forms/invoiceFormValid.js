import * as constants from 'constants/uiNames';

export const validate =  ( values ) => {
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
    }

    return errors;
}