import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import SubsequentYearsForm from 'components/modules/coordinator/publicProcurement/applications/forms/subsequentYearsForm';
import {validate} from 'components/modules/coordinator/publicProcurement/applications/forms/subsequentYearsFormValid';

let SubsequentYearsFormContainer = reduxForm({
    form: 'SubsequentYearsForm',
    touchOnChange: true,
    validate,
    enableReinitialize: true,
}) (SubsequentYearsForm)
const selector = formValueSelector('SubsequentYearsForm') // <-- same as form name

SubsequentYearsFormContainer = connect(
    state => {
        // can select values individually
        const yearExpenditureNet = selector(state, 'yearExpenditureNet')
        const vat = selector(state, 'vat')

        return {
            yearExpenditureNet,
            vat,
        }
    }
)(SubsequentYearsFormContainer)

export default SubsequentYearsFormContainer