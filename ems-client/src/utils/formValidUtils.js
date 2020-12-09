import * as constants from 'constants/uiNames';

export function isValidNip(nip) {
    if(typeof nip !== 'string')
        return constants.FORM_ERROR_MSG_INVALID_NIP;

    nip = nip.replace(/[ -]/gi, '');

    let weight = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    let sum = 0;
    let controlNumber = parseInt(nip.substring(9, 10));
    for (let i = 0; i < weight.length; i++) {
        sum += (parseInt(nip.substring(i, i + 1)) * weight[i]);
    }
    if(sum % 11 !== controlNumber){
        return constants.FORM_ERROR_MSG_INVALID_NIP;
    };
};

export function isValidRegon(regon) {
	if(typeof regon != 'string')
        return constants.FORM_ERROR_MSG_INVALID_REGON;

    regon = regon.replace(/[ - _]/gi, '');

	if((regon.length !== 9) && (regon.length !== 14))
		return constants.FORM_ERROR_MSG_INVALID_REGON;


	const weight9 = [8, 9, 2, 3, 4, 5, 6, 7];
	const weight14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];

	if(regon.length === 9){

		let controlNumber = parseInt(regon.substring(8, 9));
		return idValid(weight9, controlNumber);
	} else {
		let controlNumber = parseInt(regon.substring(13, 14));
		return idValid(weight14, controlNumber);
	}

	function idValid(weight, controlNumber){
		let sum = 0;
		for (let i = 0; i < weight.length; i++) {
			sum += (parseInt(regon.substring(i, i + 1)) * weight[i]);
		}

		if(sum % 11 === 10){
			controlNumber = 0;
		}

		if (sum % 11 !== controlNumber){
	        return constants.FORM_ERROR_MSG_INVALID_REGON;
	    }
	}
};

export function isValidEmail(email){
    if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
       return constants.FORM_ERROR_MSG_INVALID_EMAIL_ADDRESS;
    }
};

export function isValidCode(code){
    if (!/^[a-zA-Z0-9]{1,10}$/i.test(code)){
        return constants.FORM_ERROR_MSG_INVALID_CHAR
    }
};

export function isValidZipCode(zipCode){
    if (!/^\d{2}\s-\s\d{3}$/i.test(zipCode)){
        return constants.FORM_ERROR_MSG_INVALID_ZIP_CODE
    }
};

export function isValidPhoneFaxNumber(number, type){
    if (!/^\+\d{2}\s\(\d{2}\)\s\d{3}(\s\d{2}){2}$/i.test(number)){
        switch(type){
            case 'phone':
                return constants.FORM_ERROR_MSG_INVALID_PHONE_NUMBER;
            case 'fax':
                return constants.FORM_ERROR_MSG_INVALID_FAX_NUMBER;
            default:
                return constants.FORM_ERROR_MSG_INVALID_PHONE_NUMBER;
        }
    }
};

export function isValidDate(date) {
    const curDate = Date.parse(date);
    const maxDate = new Date(2100,0,1)
    const minDate = new Date(1900,0,1)

    if (!curDate){
        return constants.FORM_ERROR_MSG_INVALID_DATE;
    } else if (curDate < minDate) {
        return constants.DATE_PICKER_MIN_DATE_MESSAGE;
    } else if(curDate > maxDate){
        return constants.DATE_PICKER_MAX_DATE_MESSAGE;
    }
    return null;
}