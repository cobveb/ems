import * as constants from 'constants/uiNames';
import { touch } from 'redux-form';
export const validate =  ( values, props ) => {
    const errors = {
        name: {},
    }
    const requiredFields = [
        'name', 'positionIncludedPlanType', 'amountNet', 'amountGross','coordinatorPlanPosition'
    ]

    requiredFields.forEach(field => {
        if(field === 'name'){
            if(values["name"] === undefined || !values["name"].content){
                errors["name"].content = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        } else if (['amountNet','amountGross'].includes(field)){
            if(values[field] === 0 && !values["optionValueNet"] && !values["optionValueGross"]){
                /*
                    Validation for an invoice position whether there is an amount of zero
                    or greater than zero if the option amount is defined
                */
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            } else if (!values[field] && values[field] !== 0) {
                /*
                    Validation whether there are amounts for the invoice position
                    if the option amount is not defined
                */
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.amountNet){
        /* Check if current position value not exceeded coordinator plan position awarded value */
        if(props.invoice.contract !== undefined && props.invoice.contract !== null){
            if(props.invoice.contract.realPrevYearsValueNet !== null){
                if(props.action === 'add'){
                    if((props.invoice.contract.invoicesValueNet + props.invoice.contract.realPrevYearsValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                } else {
                    if((props.invoice.contract.invoicesValueNet + props.invoice.contract.realPrevYearsValueNet - props.initialValues.amountNet + values.amountNet).toFixed(2) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                }
            } else {
                if(props.action === 'edit'){
                    if(((props.invoice.contract.invoicesValueNet - props.initialValues.amountNet) + values.amountNet) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                } else {
                    if((props.invoice.contract.invoicesValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                }
            }
        }
    }

    if(values.amountGross){
        /* Check if current position value not exceeded coordinator plan position awarded value */
        if(values.coordinatorPlanPosition !== undefined){
            if(values.coordinatorPlanPosition.amountRealizedGross !== null){
                if(props.initialValues.amountGross !== undefined){
                    if(values.coordinatorPlanPosition.amountRealizedGross - props.initialValues.amountGross + values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                    }
                } else {
                    if(values.coordinatorPlanPosition.amountRealizedGross + values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                    }
                }
            } else {
                if(props.initialValues.amountGross !== undefined){
                    if(props.initialValues.amountGross + values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                    }
                } else {
                    if(values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                    }
                }
            }
        }
        if(values.amountNet !== undefined){
            if(values.amountNet > 0 && values.amountNet > values.amountGross){
                errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_VALUE_NET_INVALID
                props.dispatch(touch('InvoicePositionForm','amountNet'))
            } else if (values.amountNet < 0 && values.amountNet < values.amountGross){
                errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_VALUE_NET_INVALID
                props.dispatch(touch('InvoicePositionForm','amountNet'))
            }
        }
        if(props.invoice.contract !== undefined && props.invoice.contract !== null){
            if(props.invoice.contract.realPrevYearsValueGross !== null){
                if(props.action === 'add'){
                    if((props.invoice.contract.invoicesValueGross + props.invoice.contract.realPrevYearsValueGross + values.amountGross) > props.invoice.contract.contractValueGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                    /* Check if current position value not exceeded contract amount net */
                    if((props.invoice.contract.invoicesValueNet + props.invoice.contract.realPrevYearsValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                        props.dispatch(touch('InvoicePositionForm','amountNet'))
                    }
                } else {
                    if((props.invoice.contract.invoicesValueGross + props.invoice.contract.realPrevYearsValueGross - props.initialValues.amountGross + values.amountGross).toFixed(2) > props.invoice.contract.contractValueGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                    /* Check if current position value not exceeded contract amount net */
                    if((props.invoice.contract.invoicesValueNet + props.invoice.contract.realPrevYearsValueNet - props.initialValues.amountNet + values.amountNet).toFixed(2) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                        props.dispatch(touch('InvoicePositionForm','amountNet'))
                    }
                }
            } else {
                if(props.action === 'edit'){
                    if(((props.invoice.contract.invoicesValueGross - props.initialValues.amountGross) + values.amountGross) > props.invoice.contract.contractValueGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                    /* Check if current position value not exceeded contract amount net */
                    if(((props.invoice.contract.invoicesValueNet - props.initialValues.amountNet) + values.amountNet) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                        props.dispatch(touch('InvoicePositionForm','amountNet'))
                    }
                } else {
                    if((props.invoice.contract.invoicesValueGross + values.amountGross) > props.invoice.contract.contractValueGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    }
                    /* Check if current position value not exceeded contract amount net */
                    if((props.invoice.contract.invoicesValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                        errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                        props.dispatch(touch('InvoicePositionForm','amountNet'))
                    }
                }
            }
        }
    }
    /* Check if current position value not exceeded coordinator plan position awarded value */
    if(values.coordinatorPlanPosition){
        /* Check if current coordinator plan position exist realized value gross */
        if(values.coordinatorPlanPosition.amountRealizedGross !== null){
            /* Check if for current invoice position exist old amount gross */
            if(props.initialValues.amountGross !== undefined){
                /* Check if current invoice position contain contract with option value */
                if(props.invoice.contract !== undefined && props.invoice.contract !== null && props.invoice.contract.percentOption !== null){
                    /* Check if for current invoice position exist old option gross value */
                    if(props.initialValues.optionValueGross !== null){
                        if(values.coordinatorPlanPosition.amountRealizedGross - props.initialValues.amountGross - props.initialValues.optionValueGross
                            + values.amountGross + values.optionValueGross > values.coordinatorPlanPosition.amountAwardedGross){
                            errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                            errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                            props.dispatch(touch('InvoicePositionForm','amountGross'))
                        }
                    } else {/* If for current invoice position not exist old option gross value */
                        if(values.coordinatorPlanPosition.amountRealizedGross - props.initialValues.amountGross + values.amountGross + values.optionValueGross > values.coordinatorPlanPosition.amountAwardedGross){
                            errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                            errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                            props.dispatch(touch('InvoicePositionForm','amountGross', 'optionValueGross'))
                        }
                    }
                } else {
                    /* If current invoice position not contain contract with option value but exist old amount gross */
                    if(values.coordinatorPlanPosition.amountRealizedGross - props.initialValues.amountGross + values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                        props.dispatch(touch('InvoicePositionForm','amountGross'))
                    }
                }
            } else {/* If add new invoice position. */
                /* Check if new invoice position contain contract with option value */
                if(props.invoice.contract !== undefined && props.invoice.contract !== null && props.invoice.contract.percentOption !== null){
                    if(values.coordinatorPlanPosition.amountRealizedGross + values.amountGross + values.optionValueGross > values.coordinatorPlanPosition.amountAwardedGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                        errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                        props.dispatch(touch('InvoicePositionForm','amountGross'))
                    }
                } else {/* if new invoice position not contain contract with option value */
                    if(values.coordinatorPlanPosition.amountRealizedGross + values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                        errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                        props.dispatch(touch('InvoicePositionForm','amountGross'))
                    }
                }
            }
        } else { /* Current coordinator plan position not exist realized value gross */
            /* Check if current invoice position contain contract with option value */
            if(props.invoice.contract !== undefined && props.invoice.contract !== null && props.invoice.contract.percentOption !== null){
                if(values.amountGross + values.optionValueGross > values.coordinatorPlanPosition.amountAwardedGross){
                    errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                    errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_OPTION_VALUE_EXCEEDED
                    props.dispatch(touch('InvoicePositionForm','amountGross'))
                }
            } else { /* if current invoice position not contain contract with option value */
                if(values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                    errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                    props.dispatch(touch('InvoicePositionForm','amountGross'))
                }
            }
        }
    }

    /* Option value validations only on amount gross */
    if(values.optionValueGross){
        if(props.vat !== undefined && props.vat.code === "R") {
            if(!values["optionValueNet"]){
                /* Check if exist option value net for VAT equal "R" */
                errors["optionValueNet"] = constants.FORM_ERROR_MSG_INVALID_VALUE
                props.dispatch(touch('InvoicePositionForm','optionValueNet'))
            } else if (values.optionValueNet > values.optionValueGross){
                errors["optionValueNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_OPTION_VALUE_NET_INVALID
                props.dispatch(touch('InvoicePositionForm','optionValueNet'))
            }
        }
        if(props.invoice.contract.realizedOptionValueGross === null){
            /*  Check if option value gross is greater that contract option value gross */
            if(props.invoice.contract.optionValueGross < values.optionValueGross){
                errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_OPTION_VALUE_EXCEEDED
                props.dispatch(touch('InvoicePositionForm','optionValueGross'))
            }
        } else {
            if(props.action === 'add'){
                if(props.invoice.contract.optionValueGross < (props.invoice.contract.realizedOptionValueGross  +
                    values.optionValueGross).toFixed(2)){
                    /*
                        Check if option value gross is greater that contract option value gross on add new invoice position
                        if exist contract realized option value gross
                    */
                    errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_OPTION_VALUE_EXCEEDED
                    props.dispatch(touch('InvoicePositionForm','optionValueGross', 'optionValueNet'))
                }
            } else {
                if(props.invoice.contract.optionValueGross < ((props.invoice.contract.realizedOptionValueGross - props.initialValues.optionValueGross) +
                    values.optionValueGross).toFixed(2)){
                    /*
                        Check if option value gross is greater that contract option value gross on edit invoice position
                        if exist contract realized option value net
                    */
                    errors["optionValueGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_OPTION_VALUE_EXCEEDED
                    props.dispatch(touch('InvoicePositionForm','optionValueGross', 'optionValueNet'))
                }
            }
        }
    }

    if(values.optionValueNet){
        if(props.vat !== undefined && props.vat.code === "R") {
            if(!values["optionValueGross"]){
                /* Check if exist option value gross for VAT equal "R" */
                errors["optionValueGross"] = constants.FORM_ERROR_MSG_INVALID_VALUE
                props.dispatch(touch('InvoicePositionForm','optionValueGross'))
            }
        }
    }
    return errors;
}