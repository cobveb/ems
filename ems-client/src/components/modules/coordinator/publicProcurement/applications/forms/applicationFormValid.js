import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {

    const errors = {
        applicationProtocol: {},
    }
    const requiredFields = [
        'mode', 'orderedObject',  'reasonNotIncluded', 'orderIncludedPlanType', 'replaySourceApplication', 'createDate','sendDate', 'estimationType'
    ]

    const requiredFieldsBelow130 = [
         'coordinatorCombined', 'orderRealizationTerm', 'justificationPurchase', 'orderDescription',
         'orderContractorConditions','orderImportantRecords', 'warrantyRequirements',
    ]

    const requiredFieldsAbove130 = [
        'orderReasonLackParts', 'cpv', 'orderValueBased', 'orderValueSettingPerson', 'dateEstablishedValue', 'orderContractorName',
        'personsPreparingDescription', 'requirementsVariantBids', 'proposedOrderingProcedure', 'personsPreparingJustification',
        'personsChoosingContractor', 'personsPreparingConditions', 'personsPreparingCriteria', 'tenderCommittee',
    ]

    const requiredFieldsBelow50 = [
        'contractor', 'contractorDesc', 'receivedOffers', 'justificationChoosingOffer'
    ]

    const requiredArrayFields = [
        'assortmentGroups', 'parts', 'criteria'
    ]

    const requireCheckboxFields = [
        'email', 'phone', 'internet', 'paper', 'other', 'renouncement'
    ]

    requiredFields.forEach(field => {
        if(field === 'reasonNotIncluded'){
            if (!values[field] && values.mode !== undefined && values.mode.code === 'UP') {
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        } else if (field === 'replaySourceApplication'){
            if(!values[field] && values.isReplay){
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        } else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })

    if(values.status !== undefined){
        requiredFieldsBelow130.forEach(field => {
            if(field === 'coordinatorCombined'){
                if (!values[field] && values.isCombined === true) {
                    errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
            } else if(field === 'orderContractorConditions') {
                if(values.estimationType !== undefined && values.estimationType !== null && values.estimationType.code === 'DO130' && !values[field]){
                     errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
                }
            } else if (field === "orderImportantRecords") {
                if(!values[field] && values.estimationType !== undefined && values.estimationType !== null && ['PO130','UE139'].includes(values.estimationType.code)){
                     errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
                }
            } else if (!values[field]) {
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
            }
        })
        if(values.estimationType !== undefined && values.estimationType !== null){
            if(['PO130','UE139'].includes(values.estimationType.code)){
                requiredFieldsAbove130.forEach(field => {
                    if (field === 'orderReasonLackParts' && values.isParts === false){
                        if(!values[field]){
                            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
                        }
                    }
                    else if (!values[field]) {
                        errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD;
                    }
                })
            } else if(values.estimationType.code === 'DO50'){
                requiredFieldsBelow50.forEach(field => {
                    if(field === 'contractor'){
                        if(values.applicationProtocol !== null && (values.applicationProtocol[field] === null || values.applicationProtocol[field].code === null)){
                            errors.applicationProtocol[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                        }
                    }
                    if(field === 'contractorDesc'){
                        if(values.applicationProtocol !== null && !values.applicationProtocol[field]){
                            errors.applicationProtocol[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                        }
                    }
                    else if (values.applicationProtocol !== null && !values.applicationProtocol[field]) {
                        errors.applicationProtocol[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                    }
                })
                if(values.applicationProtocol !== null && values.applicationProtocol["other"] && !values.applicationProtocol["otherDesc"]){
                    errors.applicationProtocol["otherDesc"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
                if(values.applicationProtocol !== null && values.applicationProtocol["renouncement"] && !values.applicationProtocol["nonCompetitiveOffer"]){
                    errors.applicationProtocol["nonCompetitiveOffer"] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
                if(values.applicationProtocol !== null && values.applicationProtocol["prices"].length === 0){
                    errors.applicationProtocol["prices"] = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ARRAY_FIELD_REQUIRE;
                }
                if(values.applicationProtocol !== null && requireCheckboxFields.find(field => values.applicationProtocol[field] !== false) === undefined){
                    errors.applicationProtocol["email"] = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CHECKBOX_FIELD_REQUIRE;
                }
            }
        }

        requiredArrayFields.forEach(field =>{
            if(field === "parts"){
                if(values.isParts === true){
                    if(values.parts.length === 0){
                        errors[field] = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ARRAY_FIELD_REQUIRE
                    }
                }
            } else if (field === "assortmentGroups"){
                if(values[field].length === 0){
                    errors["assortmentGroups"] = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ARRAY_FIELD_REQUIRE
                }
                else if (values[field].length > 0) {
                    values[field].forEach(group => {
                        if(group.applicationAssortmentGroupPlanPositions.length === 0){
                            errors["planPositions"] = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENTS_GROUPS_PLAN_POSITION_REQUIRE
                        }
                    })

                }
            } else if(values[field].length === 0 ){
                errors[field] = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ARRAY_FIELD_REQUIRE
            }
        })
    }

    return errors
}