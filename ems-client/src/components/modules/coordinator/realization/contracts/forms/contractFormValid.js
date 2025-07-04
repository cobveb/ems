import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {

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

        if((values.invoicesValueNet + values.realPrevYearsValueNet ) > values.contractValueNet){
            errors["contractValueNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
        }
        if((values.invoicesValueGross + values.realPrevYearsValueGross ) > values.contractValueGross){
            errors["contractValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
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

    /*
        Validation when modifying the percentage value of contract options. Checking whether it is possible to execute
        an option greater than the modified option value
    */
    if(values.percentOption !== undefined && values.percentOption !== null){
        if(values.realizedOptionValueGross !== undefined && values.realizedOptionValueGross !== null &&
            props.initialValues.percentOption !== undefined && props.initialValues.percentOption !== null &&
                props.initialValues.percentOption !== values.percentOption){
            if(values.optionValueGross < values.realizedOptionValueGross){
                errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_INVALID
                props.dispatch(props.touch('ContractForm', 'optionValueGross'));
            }
        }

        // zmiana wartościu umowy gdy jest opcja
        if(values.optionValueGross < values.realizedOptionValueGross){
            errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_CONTRACT_OPTION_VALUE_INVALID
            props.dispatch(props.touch('ContractForm', 'optionValueGross'));
        }
    }

    return errors;
}