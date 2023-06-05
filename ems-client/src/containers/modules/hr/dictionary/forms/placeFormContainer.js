import { reduxForm } from 'redux-form';
import PlaceForm from 'components/modules/hr/dictionary/forms/placeForm';
import {validate} from 'components/modules/hr/dictionary/forms/placeFormValid';

let PlaceFormContainer = reduxForm({
    form: 'PlaceForm',
    validate,
    enableReinitialize: true,
}) (PlaceForm)


export default PlaceFormContainer