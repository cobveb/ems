import { reduxForm, formValueSelector, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import PlanUpdateFinancialContentPositionForm from 'components/modules/coordinator/plans/forms/planUpdateFinancialContentPositionForm';
import {validate} from 'components/modules/coordinator/plans/forms/planUpdateFinancialContentPositionFormValid';


let PlanUpdateFinancialContentPositionFormContainer = reduxForm({
    form: 'PlanUpdateFinancialContentPositionForm',
    validate,
    enableReinitialize: true,
}) (PlanUpdateFinancialContentPositionForm)

const selector = formValueSelector('PlanUpdateFinancialContentPositionForm') // <-- same as form name
const planSelector = formValueSelector('PlanUpdateForm') // <-- same as form name

PlanUpdateFinancialContentPositionFormContainer = connect(
    state => {
        // can select values individually
        const formValues = getFormValues('PlanUpdateFinancialContentPositionForm')(state)
        const amountRequestedNet = selector(state, 'amountRequestedNet')
        const amountRequestedGross = selector(state, 'amountRequestedGross')
        const amountAwardedNet = selector(state, 'amountAwardedNet')
        const amountAwardedGross = selector(state, 'amountAwardedGross')
        const subPositions = selector(state, 'subPositions')
        const vat = selector(state,'vat')
        const planPositions = planSelector(state, 'positions')

        return {
            formValues,
            amountRequestedNet,
            amountRequestedGross,
            amountAwardedNet,
            amountAwardedGross,
            subPositions,
            vat,
            planPositions,
        }
    }
)(PlanUpdateFinancialContentPositionFormContainer)

export default PlanUpdateFinancialContentPositionFormContainer