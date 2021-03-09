import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PlanFinancialContentPositionForm from 'components/modules/coordinator/plans/forms/planFinancialContentPositionForm';
import {validate} from 'components/modules/coordinator/plans/forms/planFinancialContentPositionFormValid';


let PlanFinancialContentPositionFormContainer = reduxForm({
    form: 'PlanFinancialContentPositionForm',
    validate,
    enableReinitialize: true,
}) (PlanFinancialContentPositionForm)

const selector = formValueSelector('PlanFinancialContentPositionForm') // <-- same as form name
const planSelector = formValueSelector('PlanBasicInfoForm') // <-- same as form name

PlanFinancialContentPositionFormContainer = connect(
    state => {
        // can select values individually
        const amountRequestedNet = selector(state, 'amountRequestedNet')
        const amountRequestedGross = selector(state, 'amountRequestedGross')
        const subPositions = selector(state, 'subPositions')
        const vat = selector(state,'vat')
        const planPositions = planSelector(state, 'positions')

        return {
            amountRequestedNet,
            amountRequestedGross,
            subPositions,
            vat,
            planPositions,
        }
    }
)(PlanFinancialContentPositionFormContainer)

export default PlanFinancialContentPositionFormContainer