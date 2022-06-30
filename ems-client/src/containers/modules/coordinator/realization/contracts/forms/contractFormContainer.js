import { reduxForm } from 'redux-form';
import ContractForm from 'components/modules/coordinator/realization/contracts/forms/contractForm';
import {validate} from 'components/modules/coordinator/realization/contracts/forms/contractFormValid';

let ContractFormContainer = reduxForm({
    form: 'ContractForm',
    validate,
    enableReinitialize: true,
    touchOnChange: true,
}) (ContractForm)

export default ContractFormContainer