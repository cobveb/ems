import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import PlanUpdateForm from 'components/modules/coordinator/plans/forms/planUpdateForm';
import {validate} from 'components/modules/coordinator/plans/forms/planUpdateFormValid';

let PlanUpdateFormContainer = reduxForm({
    form: 'PlanUpdateForm',
    touchOnChange: true,
    validate,
    enableReinitialize: true,
}) (PlanUpdateForm)


PlanUpdateFormContainer = connect(state => {
        const formFinancialValues = getFormValues('PlanFinancialContentPositionForm')(state)
        const formPublicProcurementValues = getFormValues('PlanPublicProcurementContentPositionForm')(state)
        const formInvestmentValues = getFormValues('PlanInvestmentContentPositionForm')(state)

        return{
            formFinancialValues,
            formPublicProcurementValues,
            formInvestmentValues,
        }
    }
)(PlanUpdateFormContainer)

export default PlanUpdateFormContainer