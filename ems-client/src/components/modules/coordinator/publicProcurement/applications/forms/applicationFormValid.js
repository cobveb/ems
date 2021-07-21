import * as constants from 'constants/uiNames';

export const validate =  ( values, props ) => {
    const errors = {}
    const requiredFields = [
        'mode', 'orderedObject', 'reasonNotIncluded'
    ]

    const requiredFieldsBelow130 = [
         'coordinatorCombined', 'orderRealizationTerm', 'estimationType', 'justificationPurchase', 'orderDescription',
         'orderContractorName',  'orderContractorConditions','orderImportantRecords', 'warrantyRequirements',
    ]

    const requiredFieldsAbove130 = [
        'orderReasonLackParts', 'cpv', 'orderValueBased', 'orderValueSettingPerson', 'dateEstablishedValue',
        'personsPreparingDescription', 'requirementsVariantBids', 'proposedOrderingProcedure', 'personsPreparingJustification',
        'personsChoosingContractor', 'personsPreparingConditions', 'personsPreparingCriteria', 'tenderCommittee',
    ]

    requiredFields.forEach(field => {
        if(field === 'reasonNotIncluded'){
            if (!values[field] && values.mode !== undefined && values.mode.code === 'UP') {
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        }
        else if (!values[field]) {
            errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
        }
    })


    if(values.status !== undefined){
        requiredFieldsBelow130.forEach(field => {
            if(field === 'coordinatorCombined'){
                if (!values[field] && values.isCombined === true) {
                    errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
            } else if (!values[field]) {
                errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
            }
        })
        if(values.estimationType !== undefined && values.estimationType !== null && ['PO130','UE139'].includes(values.estimationType.code)){
            requiredFieldsAbove130.forEach(field => {
                if (field === 'orderReasonLackParts'){
                    if(values.isParts === false){
                        errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                    }
                }
                else if (!values[field]) {
                    errors[field] = constants.FORM_ERROR_MSG_REQUIRED_FIELD
                }
            })
        }
    }
//
//    if(values.orderValueNet){
//        console.log(values.assortmentGroups)
//        console.log(props.formCurrentValues.assortmentGroups)
//        const maxOrderValueNet = values.assortmentGroups.reduce((prev, cur) => prev + cur.amountRequestedNet, 0);
//        console.log(maxOrderValueNet)
//        console.log(values.orderValueNet)
//        if(maxOrderValueNet < values.orderValueNet){
//            errors.orderValueNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENTS_GROUPS_NET_EXCEEDED;
//        }
//    }
//
//    if(values.orderValueYearNet){
//        if(values.orderValueNet < values.orderValueYearNet){
//            errors.orderValueYearNet = constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_NET_EXCEEDED;
//        }
//    }
    return errors
}