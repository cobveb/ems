import { validate } from 'components/modules/administrator/institutionFormValid';
import * as constants from 'constants/uiNames';

const fields = {
    code:"%",
    shortName:"",
    name:"",
    nip:"23",
    regon:"23",
    zipCode:"23",
    phone:"32",
    fax:"32",
    email: 'test',
};

const expectValid = {
    error: {
    code: constants.FORM_ERROR_MSG_INVALID_CHAR,
    shortName: constants.FORM_ERROR_MSG_REQUIRED_FIELD,
    name: constants.FORM_ERROR_MSG_REQUIRED_FIELD,
    nip: constants.FORM_ERROR_MSG_INVALID_NIP,
    regon: constants.FORM_ERROR_MSG_INVALID_REGON,
    zipCode: constants.FORM_ERROR_MSG_INVALID_ZIP_CODE,
    phone: constants.FORM_ERROR_MSG_INVALID_PHONE_NUMBER,
    fax: constants.FORM_ERROR_MSG_INVALID_FAX_NUMBER,
    email: constants.FORM_ERROR_MSG_INVALID_EMAIL_ADDRESS,
    }
};

describe("InstitutionFormValid component", () => {
    it("it should handle error on valid", ()=> {
        expect(validate(fields)).toEqual(expectValid.error);
    })
});
