import * as constants from 'constants/uiNames';
import {isValidDate} from 'utils/';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'year',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }

        if (values.year){
            errors.year = isValidDate(values.year);
            if(errors.year === null){
                if( props.years.find(obj => {
                     return ((new Date(obj.year).getFullYear() === new Date(values.year).getFullYear()) && obj.id !== values.id )
                    }) !== undefined){
                        errors.year = constants.ACCOUNTANT_COST_TYPE_YEAR_EXISTS;
                }
            }
        }
    })

    return errors
}