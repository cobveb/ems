import { reduxForm } from 'redux-form';
import DirectorCoordinatorsForm from 'components/modules/administrator/ou/directorCoordinatorsForm';


let DirectorCoordinatorsFormContainer = reduxForm({
    form: 'DirectorCoordinatorsForm',
    touchOnChange: true,
    enableReinitialize: true,
}) (DirectorCoordinatorsForm)

export default DirectorCoordinatorsFormContainer