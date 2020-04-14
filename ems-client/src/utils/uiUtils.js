import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

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
