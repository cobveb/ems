import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFieldsOnCreate = [
        'type', 'sourceAmountRequestedGross', 'sourceExpensesPlanGross'
    ]

    const requiredFieldsOnCorrect = [
        'type', 'sourceAmountAwardedGross', 'sourceExpensesPlanAwardedGross'
    ]

    if(props.planStatus === 'ZP'){
        requiredFieldsOnCreate.forEach(field => {
            if (!values[field]) {
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        })
    } else {
        requiredFieldsOnCorrect.forEach(field => {
            if(values[field] !== 0){
                if (!values[field]) {
                    errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
            }
        })
    }

    if(values.type){
        if(props.positions.find(position =>{
            return (position.type.code === values.type.code && position.id !== values.id) }) !== undefined){
                errors.type = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXISTS;
            }
    }

    if(values.sourceExpensesPlanGross || values.sourceAmountGross){
        if(values.sourceExpensesPlanGross > values.sourceAmountGross)
            errors.sourceExpensesPlanGross = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_EXPENSES_PLAN_GROSS;
    }

    if(values.sourceExpensesPlanAwardedGross || values.sourceAmountAwardedGross){
        /* Check only if plan is forward to coordinator (status equal PK) */
        if(props.planStatus === 'PK'){
            /* Check if current sourceExpensesPlanAwardedGross value is greater than current sourceAmountAwardedGross */
            if(values.sourceExpensesPlanAwardedGross > values.sourceAmountAwardedGross){
                errors.sourceExpensesPlanAwardedGross = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_EXPENSES_PLAN_GROSS;
            } else {
                const positionSource = props.positionFundingSources.filter(source => source.type.code === values.type.code)
                console.log(positionSource)
                if(positionSource.length > 0){
                    /* Check if source awarded gross current value is greater than position source value */
                    if(positionSource[0].sourceAmountAwardedGross < values.sourceAmountAwardedGross){
                        errors.sourceAmountAwardedGross = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_AWARDED_GROSS;
                    }
                    /* Check if source expenses awarded gross current value is greater than position source value */
                    if (positionSource[0].sourceExpensesPlanAwardedGross < values.sourceExpensesPlanAwardedGross){
                        errors.sourceExpensesPlanAwardedGross = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_EXPENSES_AWARDED_GROSS;
                    }

                    /* Check if exist other target unit*/
                    if(props.targetUnits.length > 1) {
                        let sumSourceAwardedGross = 0;
                        let sumSourceExpenseAwardedGross = 0;
                        props.targetUnits.forEach(unit =>{
                            if(unit.targetUnit.code !== props.positionUnit.code){
                                const source = unit.fundingSources.filter(source => source.type.code === values.type.code)
                                if(source.sourceAmountAwardedGross !== null && source.sourceExpensesPlanAwardedGross !== null){
                                    sumSourceAwardedGross += source.sourceAmountAwardedGross;
                                    sumSourceExpenseAwardedGross += source.sourceExpensesPlanAwardedGross;
                                }
                            }
                        })
                        /* Check if sum source awarded gross other target units and current value is greater than position source value */
                        if(positionSource[0].sourceAmountAwardedGross < (sumSourceAwardedGross + values.sourceAmountAwardedGross)){
                            errors.sourceAmountAwardedGross = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_UNITS_SOURCE_AWARDED_GROSS;
                        }
                        /* Check if sum source expenses awarded gross other target units and current value is greater than position source value */
                        if (positionSource[0].sourceExpensesPlanAwardedGross < (sumSourceExpenseAwardedGross + values.sourceExpensesPlanAwardedGross)){
                            errors.sourceExpensesPlanAwardedGross = constants.COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_UNITS_SOURCE_EXPENSES_AWARDED_GROSS;
                        }
                    }
                }
            }
        }
    }

    return errors
}