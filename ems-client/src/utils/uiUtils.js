import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import * as constants from 'constants/uiNames';

export function digitsAndNumberMask(rawValue){
/*
    Mask allowed input only digits and number
    Used: SearchField
*/
    let mask = []
    rawValue = rawValue.replace(/[^A-Za-z0-9]/g, '');
    mask.push(rawValue);
    return mask;
}

export function numberMask(rawValue){
/*
    Mask allowed input only number
*/
    let mask = []
    rawValue = rawValue.replace(/[^0-9]/g, '');
    mask.push(rawValue);
    return mask;
}

export function TextMaskCustom(type) {
    return (props) => {
        const { inputRef, ...other } = props;
        return (
            <MaskedInput
                {...other}
                ref={ref => {
                    inputRef(ref ? ref.inputElement : null);
                }}
                mask={type === "numbers" ? numberMask : digitsAndNumberMask}
                placeholderChar={'\u2000'}
                showMask
                onChange={() => {}}
            />
        );
    }
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};


export function TextMask(pattern) {
/*
    Function return MaskedInput with mask as parameter
    Used: in Redux Form
*/
    return (props) => {
        const { inputRef, ...other } = props;
        return (
            <MaskedInput
                {...other}
                    ref={ref => {
                        inputRef(ref ? ref.inputElement : null);
                    }}
                mask={pattern}
                guide={true}
                onChange={() => {}}
            />
        );
    }
}

TextMask.propTypes = {
    inputRef: PropTypes.func.isRequired,
    pattern: PropTypes.array.isRequired,
};

function sortTreeNode(nodeA, nodeB){
    const nameA = nodeA.name.toUpperCase();
    const nameB = nodeB.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
        comparison = 1;
    } else if (nameA < nameB) {
        comparison = -1;
    }
    return comparison;
}

function recurrenceTreeStructure(ous, nodes, parent){
    let units = []
    nodes.forEach(node => {
        parent.nodes.push(node)
        ous = ous.filter(ou => ou.code !== node.code)
        units = ous.filter(ou => ou.parent === node.code)
        if(units.length > 0){
            ous = recurrenceTreeStructure(ous, units, node)
        }
    })
    return ous;
};

export function generateTreeStructure(data){
    let ous = data;
    let structure = [];
    let units = [];

    ous.sort(sortTreeNode)

    ous.forEach(ou =>{
        ou.nodes = []
    })

    while(ous.length > 0){
        let parent = ous.filter(node => node.parent === null)
        if(parent.length === 1){
            structure.push(parent[0])
            ous = ous.filter(ou => ou.code !== parent[0].code)
            units = ous.filter(ou => ou.parent === parent[0].code)
            ous = recurrenceTreeStructure(ous, units, parent[0])
        } else {
            while(ous.length > 0){
                let parent = ous[0]
                if(structure.length && structure[0].parent === null){
                    structure[0].nodes.push(parent)
                } else {
                    structure.push(parent)
                }

                ous = ous.filter(ou => ou.code !== parent.code)
                units = ous.filter(ou => ou.parent === parent.code)
                if(units.length > 0){
                    ous = recurrenceTreeStructure(ous, units, parent)
                }
            }
        }
    }

    return structure;
};

export function isExistsOuNodes(parent, ous){
    let isExist = false;
    ous = ous.filter(ou => ou.parent === parent)
    if(ous.length > 0){
     isExist = true;
    }
    return isExist;
};

export function updateOnCloseDetails(objects, object, prop){
    if(object){
        const idProp = (prop !== undefined ? prop : 'id')
        if(object[idProp] !== undefined) { // Closed without sending data during the add action. Do not update.
            const index = objects.findIndex((oldObject) => oldObject[idProp] === object[idProp]);
            const count = (index !== -1 ? 1 : 0);
            objects.splice(index, count, object);
        }
    }
    return objects;
};

export function findSelectFieldPosition(options, searched){
    return options.find(option => {
        return option.code === searched
    });
};

export function numberWithSpaces(number){
    let parts = (parseFloat(number).toFixed(2)).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/gs, " ");
    return parts.join(".");
}


//TODO: Zmienić loklana funkcję findIndex komponentu Application na poniższą
export function findIndexElement(searchedElement, allElements, tmpId){
    return searchedElement.id ?
        allElements.findIndex(element => element.id === searchedElement.id) :
            tmpId ?
                searchedElement[tmpId]  ? // element not saved yet
                    allElements.findIndex(element => element[tmpId] === searchedElement[tmpId])
                        : null
            : null
};

export function escapeSpecialCharacters(strReplace){
    return strReplace.replace(/([()[{*+.$^\\|?])/g, '\\$1');
}

export const getCoordinatorPlanTypes = () => [
    {
        code: 'FIN',
        name: constants.COORDINATOR_PLAN_TYPE_FINANCIAL,
    },
    {
        code: 'INW',
        name: constants.COORDINATOR_PLAN_TYPE_INVESTMENT,
    },
    {
        code: 'PZP',
        name: constants.COORDINATOR_PLAN_TYPE_PUBLIC_PROCUREMENT,
    },
]

export const publicProcurementPlanTypes = () => [
    {
        code: 'FIN',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE_FINANCIAL,
    },
    {
        code: 'INW',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE_INVESTMENT,
    },
]

export const publicProcurementOrderTypes = () => [
    {
        code: 'DST',
        name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_DELIVERY,
    },
    {
        code: 'USL',
        name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_SERVICE,
    },
    {
        code: 'RBD',
        name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_CONSTRUCTION_WORKS,
    }
]

export const  publicProcurementEstimationTypes = () => [
    {
        code: 'DO50',
        name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_DO50,
    },
    {
        code: 'DO130',
        name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_D0130,
    },
    {
        code: 'PO130',
        name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_PO130,
    },
    {
        code: 'UE139',
        name: constants.COORDINATOR_PLAN_POSITION_ORDER_TYPE_UE139,
    },
]

export const publicProcurementApplicationStatuses = () => [
    {
        code: 'ZP',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_SAVE,
    },
    {
        code: 'WY',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_SEND,
    },
    {
        code: 'AZ',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_PUBLIC_PROCUREMENT,
    },
    {
        code: 'AD',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_DIRECTOR,
    },
    {
        code: 'AM',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_MEDICAL,
    },
    {
        code: 'AK',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_ACCOUNTANT,
    },
    {
        code: 'ZA',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED,
    },
    {
        code: 'RE',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_REALIZED,
    },
    {
        code: 'ZR',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_EXECUTED,
    },
    {
        code: 'AN',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_CANCELLED,
    },
]

export const publicProcurementApplicationModes = () => [
    {
        code: 'PL',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_PLANNED,
    },
    {
        code: 'UP',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_UNPLANNED,
    }
]

export const getCoordinatorPlanStatuses = () => [
    {
        code: 'ZP',
        name: constants.COORDINATOR_PLAN_STATUS_SAVED,
    },
    {
        code: 'WY',
        name: constants.COORDINATOR_PLAN_STATUS_SENT,
    },
    {
        code: 'RO',
        name: constants.COORDINATOR_PLAN_STATUS_ADOPTED,
    },
    {
        code: 'PK',
        name: constants.COORDINATOR_PLAN_STATUS_FORWARD,
    },
    {
        code: 'UZ',
        name: constants.COORDINATOR_PLAN_STATUS_AGREED,
    },
    {
        code: 'AZ',
        name: constants.COORDINATOR_PLAN_STATUS_APPROVED_PUBLIC_PROCUREMENT,
    },
    {
        code: 'AK',
        name: constants.COORDINATOR_PLAN_STATUS_APPROVED_ACCOUNTANT,
    },
    {
        code: 'AD',
        name: constants.COORDINATOR_PLAN_STATUS_APPROVED_DIRECTOR,
    },
    {
        code: 'AE',
        name: constants.COORDINATOR_PLAN_STATUS_APPROVED_ECONOMIC,
    },
    {
        code: 'AN',
        name: constants.COORDINATOR_PLAN_STATUS_APPROVED_CHIEF,
    },
    {
        code: 'ZA',
        name: constants.COORDINATOR_PLAN_STATUS_APPROVED,
    },
    {
        code: 'RE',
        name: constants.COORDINATOR_PLAN_STATUS_REALIZED,
    },
    {
        code: 'ZR',
        name: constants.COORDINATOR_PLAN_STATUS_EXECUTED,
    },
    {
        code: 'AA',
        name: constants.COORDINATOR_PLAN_STATUS_UPDATE,
    },

];

export const getInstitutionPlanStatuses = () => [
    {
        code: 'UT',
        name: constants.INSTITUTION_PLAN_STATUS_CREATED,
    },
    {
        code: 'AK',
        name: constants.INSTITUTION_PLAN_STATUS_APPROVED_ACCOUNTANT,
    },
    {
        code: 'AZ',
        name: constants.COORDINATOR_PLAN_STATUS_APPROVED_PUBLIC_PROCUREMENT,
    },
    {
        code: 'AD',
        name: constants.INSTITUTION_PLAN_STATUS_APPROVED_DIRECTOR,
    },
    {
        code: 'AE',
        name: constants.INSTITUTION_PLAN_STATUS_APPROVED_ECONOMIC,
    },
    {
        code: 'AN',
        name: constants.INSTITUTION_PLAN_STATUS_APPROVED_CHIEF,
    },
    {
        code: 'ZA',
        name: constants.INSTITUTION_PLAN_STATUS_APPROVED,
    },
    {
        code: 'RE',
        name: constants.INSTITUTION_PLAN_STATUS_REALIZED,
    },
    {
        code: 'ZR',
        name: constants.INSTITUTION_PLAN_STATUS_EXECUTED,
    },
    {
        code: 'AA',
        name: constants.INSTITUTION_PLAN_STATUS_UPDATE,
    },
];

export const getCoordinatorPlanPositionsStatuses = () => [
    {
        code: 'DO',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_ADDED,
    },
    {
        code: 'ZP',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_SAVED,
    },
    {
        code: 'WY',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_SENT,
    },
    {
        code: 'UZ',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_AGREED,
    },
    {
        code: 'ZA',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_ACCEPT,
    },
    {
        code: 'SK',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_CORRECT,
    },
    {
        code: 'RE',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_REALIZED,
    },
    {
        code: 'ZR',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_EXECUTED,
    },
    {
        code: 'AA',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_UPDATED,
    },
    {
        code: 'KR',
        name: constants.COORDINATOR_PLAN_POSITION_STATUS_CORRECT,
    },
];

export const getPublicProcurementProtocolStatuses = () => [
    {
        code: 'AZ',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_APPROVE_PUBLIC,
    },
    {
        code: 'AK',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_APPROVE_ACCOUNTANT,
    },
    {
        code: 'ZA',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_EXECUTED,
    },
];

export const getVats = () =>  [
    {
        code: 1.00,
        name: "0%",
    },
    {
        code: 1.05,
        name: "5%",
    },
    {
        code: 1.08,
        name: "8%",
    },
    {
        code: 1.23,
        name: "23%",
    },
];

export function generateExportLink(response){
//    const type = response.headers['content-type']
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = response.headers['content-disposition'].substring(response.headers['content-disposition'].indexOf("=")+1)
    link.click()

}

export const getInvestmentPositionSourceHead = () => [
    {
        id: 'type.name',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES,
        type: 'object',
    },
    {
        id: 'sourceAmountGross',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_GROSS,
        suffix: 'zł.',
        type: 'amount',
    },
    {
        id: 'sourceAmountAwardedGross',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_AWARDED_GROSS,
        suffix: 'zł.',
        type: 'amount',
    },
    {
        id: 'sourceExpensesPlanGross',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS,
        suffix: 'zł.',
        type: 'amount',
    },
    {
        id: 'sourceExpensesPlanAwardedGross',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_AWARDED_GROSS,
        suffix: 'zł.',
        type: 'amount',
    },
];

export const getInvestmentPositionUnitsHead = () => [
    {
        id: 'targetUnit.name',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_UNIT,
        type: 'object',
    },
    {
        id: 'taskGross',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_GROSS,
        suffix: 'zł.',
        type: 'amount',
    },
    {
        id: 'amountRealizedGross',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_REALIZED_PLAN_GROSS,
        suffix: 'zł.',
        type: 'amount',
    },
    {
        id: 'amountRequestedGross',
        label: constants.COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS,
        suffix: 'zł.',
        type: 'amount',
    },
];

export const getPlanTypes = () => [
    {
        code: 'FIN',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE_FINANCIAL,
    },
    {
        code: 'INW',
        name: constants.COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE_INVESTMENT,
    },
];