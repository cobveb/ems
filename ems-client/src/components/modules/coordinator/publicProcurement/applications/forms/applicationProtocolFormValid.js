import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}
    const requiredFields = [
      'contractor', 'contractorDesc', 'receivedOffers', 'justificationChoosingOffer', 'otherDesc', 'nonCompetitiveOffer'
    ]

    const requireCheckboxFields = [
        'email', 'phone', 'internet', 'paper', 'other', 'renouncement'
    ]

    const requiredArrayFields = [
        'prices',
    ]

    requiredFields.forEach(field => {
        if(field === "otherDesc"){
            if(!values["otherDesc"] && values["other"]){
                errors["otherDesc"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        } else if(field === "nonCompetitiveOffer"){
            if(!values["nonCompetitiveOffer"] && values["renouncement"]){
                errors["nonCompetitiveOffer"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(requireCheckboxFields.find(field => values[field] !== false) === undefined){
        errors.email = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CHECKBOX_FIELD_REQUIRE;
    }
    requiredArrayFields.forEach(field =>{
        if(values[field] !== undefined && values[field].length === 0 ){
            errors[field] = [constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ARRAY_FIELD_REQUIRE]
        }
    })
    return errors;
}