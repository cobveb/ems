import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationAssortmentGroupsForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsFormValid';

let ApplicationAssortmentGroupsFormContainer = reduxForm({
    form: 'ApplicationAssortmentGroupsForm',
    validate,
    enableReinitialize: true,
}) (ApplicationAssortmentGroupsForm)

const selector = formValueSelector('ApplicationAssortmentGroupsForm') // <-- same as form name

ApplicationAssortmentGroupsFormContainer = connect(
    state => {
        // can select values individually
        const applicationProcurementPlanPosition = selector(state, 'applicationProcurementPlanPosition')
        const orderGroupValueNet = selector(state, 'orderGroupValueNet')
        const orderGroupValueGross = selector(state, 'orderGroupValueGross')
        const orderValueYearNet = selector(state, 'orderValueYearNet')
        const vat = selector(state, 'vat')
        const amountContractAwardedNet = selector(state, 'amountContractAwardedNet')
        const optionValue = selector(state, "optionValue")
        const isOption = selector(state, "isOption")
        return {
            applicationProcurementPlanPosition,
            orderGroupValueNet,
            orderGroupValueGross,
            orderValueYearNet,
            amountContractAwardedNet,
            vat,
            optionValue,
            isOption
        }
    }
)(ApplicationAssortmentGroupsFormContainer)

export default ApplicationAssortmentGroupsFormContainer