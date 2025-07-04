import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import ContractForm from 'components/modules/coordinator/realization/contracts/forms/contractForm';
import {validate} from 'components/modules/coordinator/realization/contracts/forms/contractFormValid';

let ContractFormContainer = reduxForm({
    form: 'ContractForm',
    validate,
    enableReinitialize: true,
    touchOnChange: true,
}) (ContractForm)

const selector = formValueSelector('ContractForm')

ContractFormContainer = connect(
    state => {
        const percentOption = selector(state, "percentOption")
        const contractValueNet = selector(state, "contractValueNet")
        const contractValueGross = selector(state, "contractValueGross")
        return {
            percentOption,
            contractValueNet,
            contractValueGross,
        }
    }
)(ContractFormContainer)

export default ContractFormContainer