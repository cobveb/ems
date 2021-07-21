import {isValidCode, isValidEmail, isValidNip, isValidRegon, isValidZipCode, isValidPhoneFaxNumber} from 'utils/';
import * as constants from 'constants/uiNames';

export const validate = (values, props) => {
    const errors = {}
    const requiredFields = [
        'code',
        'shortName',
        'name',
        'email'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if (values.code){
        errors.code = isValidCode(values.code);
    }

    if (values.email){
        errors.email = isValidEmail(values.email);
    }

    if (values.nip){
        errors.nip = isValidNip(values.nip)
    }

    if (values.regon){
        errors.regon = isValidRegon(values.regon)
    }

    if (values.zipCode){
        errors.zipCode = isValidZipCode(values.zipCode);
    }

    if (values.phone){
        errors.phone = isValidPhoneFaxNumber(values.phone, 'phone');
    }

    if (values.fax ){
        errors.fax = isValidPhoneFaxNumber(values.fax, 'fax')
    }

    if(values.role){
        if( props.ous.find(obj => {
             return (obj.role === values.role && obj.code !== values.code && values.role ==='CHIEF')
            }) !== undefined){
                errors.role = constants.ORGANIZATION_UNIT_ROLE_CHIEF_EXISTS;
        }
    }
    return errors
}