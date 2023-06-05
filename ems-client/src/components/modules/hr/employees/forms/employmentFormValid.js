import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}
    const requiredFields = [
        'employmentType', 'number', 'dateFrom'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
        }
    })

    if(values.employmentType){
        if(['UPR', 'KON'].includes(values.employmentType.code) && props.hrNumber === null){
            errors.employmentType = constants.EMPLOYEE_EMPLOYMENT_DETAILS_CONTRACT_TYPE_HR_NUMBER_UNDEFINED;
        }
    }

    if(values.employmentDate && values.employmentDate !== null){
        if(isNaN(Date.parse(values.employmentDate))){
            errors.employmentDate = constants.DATE_PICKER_INVALID_DATE_MESSAGE;
        }
    }

    if(values.dateFrom && values.dateFrom !== null){
        if(isNaN(Date.parse(values.dateFrom))){
            errors.dateFrom = constants.DATE_PICKER_INVALID_DATE_MESSAGE;
        }
    }

    if(values.dateTo !== null && values.dateFrom !== null){
        if(values.dateFrom > values.dateTo){
            errors.dateTo = constants.EMPLOYEE_EMPLOYMENT_DETAILS_INVALID_DATE;
            errors.dateFrom = constants.EMPLOYEE_EMPLOYMENT_DETAILS_INVALID_DATE;
        }
    }

    return errors
}