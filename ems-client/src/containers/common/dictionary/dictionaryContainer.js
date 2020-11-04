import React, { Component } from 'react';
import { connect } from "react-redux";
import { loading, setError } from 'actions/';
import Dictionary from 'components/common/dictionary/dictionary';

class DictionaryContainer extends Component{
    state = {
    }

    render(){
        const {initialValues, open, onClose} = this.props;
        return(
            <Dictionary
                initialValues={initialValues}
                open={open}
                onClose={onClose}
            />
        )
    }
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
		error: state.ui.error,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : loading,
        clearError : setError,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryContainer);
