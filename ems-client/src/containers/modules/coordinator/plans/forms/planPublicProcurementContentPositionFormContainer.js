import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PlanPublicProcurementContentPositionForm from 'components/modules/coordinator/plans/forms/planPublicProcurementContentPositionForm';
import {validate} from 'components/modules/coordinator/plans/forms/planPublicProcurementContentPositionFormValid';

let PlanPublicProcurementContentPositionFormContainer = reduxForm({
    form: 'PlanPublicProcurementContentPositionForm',
    validate,
    enableReinitialize: true,
}) (PlanPublicProcurementContentPositionForm)

const selector = formValueSelector('PlanPublicProcurementContentPositionForm') // <-- same as form name
const planSelector = formValueSelector('PlanBasicInfoForm') // <-- same as form name

PlanPublicProcurementContentPositionFormContainer = connect(
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
)(PlanPublicProcurementContentPositionFormContainer)

export default PlanPublicProcurementContentPositionFormContainer