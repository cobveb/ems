import { reduxForm, getFormValues, getFormInitialValues,} from 'redux-form';
import { connect } from 'react-redux';
import PlanBasicInfoForm from 'components/modules/coordinator/plans/forms/planBasicInfoForm';
import {validate} from 'components/modules/coordinator/plans/forms/planBasicInfoFormValid';


let PlanBasicInfoFormContainer = reduxForm({
    form: 'PlanBasicInfoForm',
    touchOnChange: true,
    validate,
    enableReinitialize: true,
}) (PlanBasicInfoForm)


PlanBasicInfoFormContainer = connect(state => {
        const formFinancialValues = getFormValues('PlanFinancialContentPositionForm')(state)
        const formFinancialInitialValues = getFormInitialValues('PlanFinancialContentPositionForm')(state)
        const formPublicProcurementValues = getFormValues('PlanPublicProcurementContentPositionForm')(state)
        const formPublicProcurementInitialValues = getFormInitialValues('PlanPublicProcurementContentPositionForm')(state)
        const formInvestmentValues = getFormValues('PlanInvestmentContentPositionForm')(state)
        const formInvestmentInitialValues = getFormInitialValues('PlanInvestmentContentPositionForm')(state)

        return{
            formFinancialValues,
            formFinancialInitialValues,
            formPublicProcurementValues,
            formPublicProcurementInitialValues,
            formInvestmentValues,
            formInvestmentInitialValues,
        }
    }
)(PlanBasicInfoFormContainer)

export default PlanBasicInfoFormContainer