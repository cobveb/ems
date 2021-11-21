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
        const formFinancialValues = getFormValues('PlanUpdateFinancialContentPositionForm')(state)
        const formPublicProcurementValues = getFormValues('PlanUpdatePublicProcurementContentPositionForm')(state)
        const formInvestmentValues = getFormValues('PlanUpdateInvestmentContentPositionForm')(state)

        return{
            formFinancialValues,
            formPublicProcurementValues,
            formInvestmentValues,
        }
    }
)(PlanUpdateFormContainer)

export default PlanUpdateFormContainer