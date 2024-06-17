import { reduxForm, formValueSelector } from 'redux-form';
import EntitlementForm from 'components/modules/asi/employees/forms/entitlementForm';
import {validate} from 'components/modules/asi/employees/forms/entitlementFormValid';
import { connect } from 'react-redux'

let EntitlementFormContainer = reduxForm({
    form: 'EntitlementForm',
    validate,
    touchOnChange: true,
    touchOnBlur: true,
    enableReinitialize: true,
}) (EntitlementForm)

const selector = formValueSelector('EntitlementForm')

EntitlementFormContainer = connect(state => {
    const entitlementSystem = selector(state, 'entitlementSystem')
    return{
        entitlementSystem,
    }
}
)(EntitlementFormContainer)

export default EntitlementFormContainer