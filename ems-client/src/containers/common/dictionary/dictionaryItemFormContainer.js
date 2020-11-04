import { reduxForm } from 'redux-form';
import DictionaryItemForm from 'components/common/dictionary/dictionaryItemForm';
import {validate} from 'components/common/dictionary/dictionaryItemFormValid';


let DictionaryItemFormContainer = reduxForm({
    form: 'DictionaryItemForm',
    validate,
    enableReinitialize: true,
}) (DictionaryItemForm)


export default DictionaryItemFormContainer