import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import {RenderTableTransferList} from 'common/form';

class FormTableTransferListField extends Component {
    render(){
        const {name, head, leftSide, rightSide, leftSideLabel, rightSideLabel, ...custom} = this.props;
        return(
            <FieldArray
                name={name}
                head={head}
                leftSideLabel={leftSideLabel}
                leftSide={leftSide}
                rightSideLabel={rightSideLabel}
                rightSide={rightSide}
                component={RenderTableTransferList}
                props={custom}
            />
        )
    }
}

FormTableTransferListField.propTypes = {
    name: PropTypes.string.isRequired,
    head: PropTypes.array.isRequired,
    leftSideLabel: PropTypes.string,
    leftSide: PropTypes.array.isRequired,
    rightSideLabel: PropTypes.string,
    rightSide: PropTypes.array.isRequired,
}


export default FormTableTransferListField