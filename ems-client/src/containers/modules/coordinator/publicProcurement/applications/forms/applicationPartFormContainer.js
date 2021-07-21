import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import ApplicationPartForm from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPartForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/applicationPartFormValid';

let ApplicationPartFormContainer = reduxForm({
    form: 'ApplicationPartForm',
    validate,
    enableReinitialize: true,
}) (ApplicationPartForm)

const selector = formValueSelector('ApplicationPartForm') // <-- same as form name

ApplicationPartFormContainer = connect(state => {
        const amountNet = selector(state, 'amountNet')
        const vat = selector(state, 'vat')
        return{
            amountNet,
            vat
        }
    }
)(ApplicationPartFormContainer)

export default ApplicationPartFormContainer