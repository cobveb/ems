import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import {RenderFormTable} from 'common/form';

class FormTableField extends Component {
    render(){
        const {name, head, allRows, checkedRows, ...custom} = this.props;
        return(
            <FieldArray
                name={name}
                head={head}
                allRows={allRows}
                checkedRows={checkedRows}
                component={RenderFormTable}
                props={custom}
            />
        )
    }
}

FormTableField.propTypes = {
    name: PropTypes.string.isRequired,
    head: PropTypes.array.isRequired,
    allRows: PropTypes.array,
    checkedRows: PropTypes.array,
    checkedColumnFirst: PropTypes.bool.isRequired,
}


export default FormTableField