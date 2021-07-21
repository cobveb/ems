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
        const orderValueYearNet = selector(state, 'orderValueYearNet')
        const vat = selector(state, 'vat')

        return {
            applicationProcurementPlanPosition,
            orderGroupValueNet,
            orderValueYearNet,
            vat,
        }
    }
)(ApplicationAssortmentGroupsFormContainer)

export default ApplicationAssortmentGroupsFormContainer