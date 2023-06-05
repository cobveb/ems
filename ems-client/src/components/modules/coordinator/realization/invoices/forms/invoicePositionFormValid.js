import * as constants from 'constants/uiNames';
import { touch } from 'redux-form';
export const validate =  ( values, props ) => {
    const errors = {
        name: {},
    }

    const requiredFields = [
        'name', 'positionIncludedPlanType', 'amountNet', 'coordinatorPlanPosition'
    ]

    requiredFields.forEach(field => {
        if(field === 'name'){
            if(values["name"] === undefined || !values["name"].content){
                errors["name"].content = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        }else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.amountNet){
        /* Check if current position value not exceeded coordinator plan position awarded value */
        if(values.coordinatorPlanPosition !== undefined){
            if(values.coordinatorPlanPosition.amountRealizedNet !== null){
                if(values.coordinatorPlanPosition.amountRealizedNet + values.amountNet > values.coordinatorPlanPosition.amountAwardedNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                }
            } else {
                if(values.amountNet > values.coordinatorPlanPosition.amountAwardedNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                }
            }
        }
        if(props.invoice.contract !== undefined && props.invoice.contract !== null){
            if(props.invoice.contract.realPrevYearsValueNet !== null){
                if((props.invoice.contract.invoicesValueNet + props.invoice.contract.realPrevYearsValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
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
            if(values.coordinatorPlanPosition.amountRealizedNet !== null){
                if(values.coordinatorPlanPosition.amountRealizedNet + values.amountNet > values.coordinatorPlanPosition.amountAwardedNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                    props.dispatch(touch('InvoicePositionForm','amountNet'))
                }
            } else {
                if(values.amountNet > values.coordinatorPlanPosition.amountAwardedNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                    props.dispatch(touch('InvoicePositionForm','amountNet'))
                }
            }

            if(values.coordinatorPlanPosition.amountRealizedGross !== null){
                if(values.coordinatorPlanPosition.amountRealizedGross + values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                    errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                }
            } else {
                if(values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                    errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
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
                if((props.invoice.contract.invoicesValueGross + props.invoice.contract.realPrevYearsValueGross + values.amountGross) > props.invoice.contract.contractValueGross){
                    errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                }
                /* Check if current position value not exceeded contract amount net */
                if((props.invoice.contract.invoicesValueNet + props.invoice.contract.realPrevYearsValueNet + values.amountNet) > props.invoice.contract.contractValueNet){
                    errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED
                    props.dispatch(touch('InvoicePositionForm','amountNet'))
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

    if(values.coordinatorPlanPosition){
        /* Check if current position value not exceeded coordinator plan position awarded value */
        if(values.coordinatorPlanPosition.amountRealizedNet !== null){
            if(values.coordinatorPlanPosition.amountRealizedNet + values.amountNet > values.coordinatorPlanPosition.amountAwardedNet){
                errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                props.dispatch(touch('InvoicePositionForm','amountNet'))
            }
        } else {
            if(values.amountNet > values.coordinatorPlanPosition.amountAwardedNet){
                errors["amountNet"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                props.dispatch(touch('InvoicePositionForm','amountNet'))
            }
        }
        if(values.coordinatorPlanPosition.amountRealizedGross !== null){
            if(values.coordinatorPlanPosition.amountRealizedGross + values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                props.dispatch(touch('InvoicePositionForm','amountGross'))
            }
        } else {
            if(values.amountGross > values.coordinatorPlanPosition.amountAwardedGross){
                errors["amountGross"] = constants.COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED
                props.dispatch(touch('InvoicePositionForm','amountGross'))
            }
        }
    }

    return errors;
}