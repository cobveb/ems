import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Workers from 'components/modules/hr/staff/workers';


class WorkersContainer extends Component {

    render(){
        const {isLoading, error, clearError} = this.props;

        return(
            <Workers
                isLoading = {isLoading}
                error = {error}
                clearError = {clearError}
                loading =   {loading}
            />
        );
    };
};

WorkersContainer.propTypes = {
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    clearError: PropTypes.func,
}

const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
    	error: state.ui.error,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkersContainer);
