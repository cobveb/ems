import { reduxForm, formValueSelector,} from 'redux-form';
import { connect } from 'react-redux';
import PlanCorrectionPositionForm from 'components/modules/accountant/coordinator/plans/forms/planCorrectionPositionForm.js';


let PlanCorrectionPositionFormContainer = reduxForm({
    form: 'PlanCorrectionPositionForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (PlanCorrectionPositionForm)

const selector = formValueSelector('PlanCorrectionPositionForm') // <-- same as form name

PlanCorrectionPositionFormContainer = connect(
    state => {
        // can select values individually
        const amountAwardedGross = selector(state, 'amountAwardedGross')
        return {
            amountAwardedGross,
        }
    }
)(PlanCorrectionPositionFormContainer)

export default PlanCorrectionPositionFormContainer