import { reduxForm } from 'redux-form';
import TrainingForm from 'components/modules/hr/employees/forms/trainingForm';
import {validate} from 'components/modules/hr/employees/forms/trainingFormValid';

let TrainingFormContainer = reduxForm({
    form: 'TrainingForm',
    validate,
    enableReinitialize: true,
}) (TrainingForm)

export default TrainingFormContainer