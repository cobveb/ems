import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
//import PlanUpdatePublicProcurementContentPositionForm from 'components/modules/coordinator/plans/forms/planUpdatePublicProcurementContentPositionForm';
//import {validate} from 'components/modules/coordinator/plans/forms/planUpdatePublicProcurementContentPositionFormValid';
import PlanPublicProcurementContentPositionForm from 'components/modules/coordinator/plans/forms/planPublicProcurementContentPositionForm';
import {validate} from 'components/modules/coordinator/plans/forms/planPublicProcurementContentPositionFormValid';

let PlanUpdatePublicProcurementContentPositionFormContainer = reduxForm({
    form: 'PlanPublicProcurementContentPositionForm',
    validate,
    enableReinitialize: true,
}) (PlanPublicProcurementContentPositionForm)

const selector = formValueSelector('PlanPublicProcurementContentPositionForm') // <-- same as form name
const planSelector = formValueSelector('PlanUpdateForm') // <-- same as form name

PlanUpdatePublicProcurementContentPositionFormContainer = connect(
    state => {
        // can select values individually
        const amountRequestedNet = selector(state, 'amountRequestedNet')
        const amountRequestedGross = selector(state, 'amountRequestedGross')
        const subPositions = selector(state, 'subPositions')
        const vat = selector(state,'vat')
        const planPositions = planSelector(state, 'positions')
        const estimationType = selector(state, 'estimationType')

        return {
            amountRequestedNet,
            amountRequestedGross,
            subPositions,
            vat,
            planPositions,
            estimationType
        }
    }
)(PlanUpdatePublicProcurementContentPositionFormContainer)

export default PlanUpdatePublicProcurementContentPositionFormContainer;