import { reduxForm } from 'redux-form';
import ContractorForm from 'components/modules/accountant/dictionary/forms/contractorForm';
import {validate} from 'components/modules/accountant/dictionary/forms/contractorFormValid';

let ContractorFormContainer = reduxForm({
    form: 'ContractorForm',
    validate,
    enableReinitialize: true,
}) (ContractorForm)


export default ContractorFormContainer