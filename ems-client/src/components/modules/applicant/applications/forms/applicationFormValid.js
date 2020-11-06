import {isValidDate} from 'utils/';
import * as constants from 'constants/uiNames';


export const validate = values => {
    const errors = {}

    const requiredFields = [
        'coordinator',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if (values.coordinator){
        if(values.coordinator.code.length === 0){
            errors.coordinator = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    }

    if (values.createDate){
        errors.createDate = isValidDate(values.createDate);
    }

    if (values.sendDate){
        errors.sendDate = isValidDate(values.sendDate);
    }
    return errors
}