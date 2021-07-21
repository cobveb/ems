import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import PlanPublicProcurementPositionDetailsForm from 'components/modules/coordinator/plans/forms/planPublicProcurementPositionDetailsForm';
import {validate} from 'components/modules/coordinator/plans/forms/planPublicProcurementPositionDetailsFormValid';


let PlanPublicProcurementPositionDetailsFormContainer = reduxForm({
    form: 'PlanPublicProcurementPositionDetailsForm',
    validate,
    enableReinitialize: true,
}) (PlanPublicProcurementPositionDetailsForm)

const selectorPlanPublicProcurementContentPositionForm = formValueSelector('PlanPublicProcurementContentPositionForm') // <-- same as form name
const selectorPlanPublicProcurementPositionDetailsForm = formValueSelector('PlanPublicProcurementPositionDetailsForm') // <-- same as form name

PlanPublicProcurementPositionDetailsFormContainer = connect(
    state => {
        // can select values individually
        const amountNet = selectorPlanPublicProcurementPositionDetailsForm(state, 'amountNet')
        const amountGross = selectorPlanPublicProcurementPositionDetailsForm(state, 'amountGross')
        const vat = selectorPlanPublicProcurementContentPositionForm(state, 'vat')
        return {
            amountNet,
            amountGross,
            vat,
        }
    }
)(PlanPublicProcurementPositionDetailsFormContainer)

export default PlanPublicProcurementPositionDetailsFormContainer