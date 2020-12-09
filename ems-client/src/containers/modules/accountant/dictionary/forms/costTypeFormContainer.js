import { reduxForm } from 'redux-form';
import CostTypeForm from 'components/modules/accountant/dictionary/forms/costTypeForm';
import {validate} from 'components/modules/accountant/dictionary/forms/costTypeFormValid';

let CostTypeFormContainer = reduxForm({
    form: 'CostTypeForm',
    validate,
    enableReinitialize: true,
}) (CostTypeForm)


export default CostTypeFormContainer