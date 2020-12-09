import { reduxForm } from 'redux-form';
import CostYearForm from 'components/modules/accountant/dictionary/forms/costYearForm';
import {validate} from 'components/modules/accountant/dictionary/forms/costYearFormValid';

let CostYearFormContainer = reduxForm({
    form: 'CostYearForm',
    validate,
    enableReinitialize: true,
}) (CostYearForm)

export default CostYearFormContainer