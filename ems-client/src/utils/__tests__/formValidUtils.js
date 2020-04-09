import * as formUtils from 'utils/';
import * as constants from 'constants/uiNames';

describe('formValidUtils', () =>{
    it('NIP - it should return undefined when NIP is vaild', () =>{
        const nip = '3426268924'

        expect(formUtils.isValidNip(nip)).toEqual(undefined);
    });

    it(' NIP - it should return error when NIP is invalid', () =>{
        const nip = '3426268920'

        expect(formUtils.isValidNip(nip)).toEqual(constants.FORM_ERROR_MSG_INVALID_NIP);
    })

    it(' NIP - it should return error when NIP is not string', () =>{
        const nip = 3426268920;

        expect(formUtils.isValidNip(nip)).toEqual(constants.FORM_ERROR_MSG_INVALID_NIP);
    })

    it('REGON - it should return undefined when REGON 9 digits is valid', () =>{
        const regon = '611271275'

        expect(formUtils.isValidRegon(regon)).toEqual(undefined);
    });

    it('REGON - it should return error when Regon 9 digits is invalid', () =>{
        const regon = '611271271'

        expect(formUtils.isValidRegon(regon)).toEqual(constants.FORM_ERROR_MSG_INVALID_REGON);
    });

    it('REGON - it should return undefined when Regon 14 digits is vaild', () =>{
        const regon = '59182343654317'

        expect(formUtils.isValidRegon(regon)).toEqual(undefined);
    });

    it('REGON - it should return error when isValidRegon 14 digits', () =>{
        const regon = '59182343654311'

        expect(formUtils.isValidRegon(regon)).toEqual(constants.FORM_ERROR_MSG_INVALID_REGON);
    });

    it('REGON - it should return error when REGON is not string', () =>{
        const regon = 611271275

        expect(formUtils.isValidRegon(regon)).toEqual(constants.FORM_ERROR_MSG_INVALID_REGON);
    });

    it('REGON - it should return error when REGON is not 9 or 14 digits', () =>{
        const regon = '5918234365431'

        expect(formUtils.isValidRegon(regon)).toEqual(constants.FORM_ERROR_MSG_INVALID_REGON);
    });

    it('EMAIL - it should return error email', () =>{
        const email = 'test'
        expect(formUtils.isValidEmail(email)).toEqual(constants.FORM_ERROR_MSG_INVALID_EMAIL_ADDRESS);
    });

    it('EMAIL - it should return undefined when email is valid', () =>{
        const email = 'test@test.com'
        expect(formUtils.isValidEmail(email)).toEqual(undefined);
    });

    it('CODE - it should return error code chars', () =>{
        const code = 'cas@';
        expect(formUtils.isValidCode(code)).toEqual(constants.FORM_ERROR_MSG_INVALID_CHAR);
    });

    it('CODE - it should return undefined when code chars is valid', () =>{
        const code = 'test';
        expect(formUtils.isValidCode(code)).toEqual(undefined);
    });

    it('ZIP-CODE - it should return error zip-code', () =>{
        const zipCode = '45254';
        expect(formUtils.isValidZipCode(zipCode)).toEqual(constants.FORM_ERROR_MSG_INVALID_ZIP_CODE);
    });

    it('ZIP-CODE - it should return undefined when zip-code is valid', () =>{
        const zipCode = '41 - 103';
        expect(formUtils.isValidZipCode(zipCode)).toEqual(undefined);
    });

    it('PHONE/FAX - it should return error phone', () =>{
        const phone = '125213';
        expect(formUtils.isValidPhoneFaxNumber(phone, 'phone')).toEqual(constants.FORM_ERROR_MSG_INVALID_PHONE_NUMBER);
    });

    it('PHONE/FAX - it should return error fax', () =>{
        const fax = '125213';
        expect(formUtils.isValidPhoneFaxNumber(fax, 'fax')).toEqual(constants.FORM_ERROR_MSG_INVALID_FAX_NUMBER);
    });

    it('PHONE/FAX - it should return error phone when type is undefined', () =>{
        const fax = '125213';
        expect(formUtils.isValidPhoneFaxNumber(fax)).toEqual(constants.FORM_ERROR_MSG_INVALID_PHONE_NUMBER);
    });

    it('PHONE/FAX - it should return undefined when phone is valid', () =>{
        const phone = '+48 (32) 333 33 33';
        expect(formUtils.isValidPhoneFaxNumber(phone, 'phone')).toEqual(undefined);
    });
});