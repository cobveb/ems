import * as constants from 'constants/uiNames';

export const validate =  ( values ) => {

    const errors = {
        contractObject: {},
    }

    const requiredFields = [
        'number', 'signingDate', 'signingPlace', 'periodFrom', 'periodTo', 'contractObject', 'contractor', 'representative', 'contractValueNet', 'contractValueGross'
    ]

    requiredFields.forEach(field => {

        if(field === 'contractObject') {
            if(values["contractObject"] === undefined || !values["contractObject"].content){
                errors["contractObject"].content = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.contractValueGross){
        if(values.contractValueNet !== undefined){
            if(values.contractValueNet > values.contractValueGross){
                errors["contractValueNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_VALUE_NET_INVALID
            }
        }
    }

    if(values.realPrevYearsValueNet !== null){
        if((values.invoicesValueNet + values.realPrevYearsValueNet ) > values.contractValueNet){
            errors["realPrevYearsValueNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
        }

        if(values.realPrevYearsValueNet > values.realPrevYearsValueGross){
            errors["realPrevYearsValueNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_VALUE_NET_INVALID
        }
    }

    if(values.realPrevYearsValueGross !== null){
        if((values.invoicesValueGross + values.realPrevYearsValueGross ) > values.contractValueGross){
            errors["realPrevYearsValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
        }
    }

    return errors;
}