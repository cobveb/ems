import * as constants from 'constants/uiNames';
import {isValidDate} from 'utils/';

export const validate =  ( values, props ) => {
    const errors = {}

    const requiredFields = [
        'year', 'yearExpenditureNet'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if (values.year){
        errors.year = isValidDate(values.year);
        if(errors.year === null){
            if(new Date().getFullYear() === new Date(values.year).getFullYear()){
                errors.year = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_EQUAL_YEAR
            }
            if(new Date().getFullYear() > new Date(values.year).getFullYear()){
                errors.year = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_PAST_YEAR
            }
            if(props.subsequentYears.find(obj => {
                 return ((new Date(obj.year).getFullYear() === new Date(values.year).getFullYear()) && obj.id !== values.id )
                })   !== undefined){
                    errors.year = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXISTS;
            }
        }
    }

    if(values.yearExpenditureNet){
        let maxValue = props.orderGroupValue - props.orderValueYearNet;
        let subsequentYearsValue = 0;
                if(props.subsequentYears.length > 0){
                    props.subsequentYears.forEach(year => {
                        if(year.id !== values.id){
                            subsequentYearsValue += year.yearExpenditureNet
                        }
                    })
                    if(maxValue < (values.yearExpenditureNet + subsequentYearsValue)){
                        errors.yearExpenditureNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_MAX_VALUE
                    }
                } else {
                    if(values.yearExpenditureNet > maxValue){
                        errors.yearExpenditureNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_MAX_VALUE
                    }
                }
    }


    return errors;
}