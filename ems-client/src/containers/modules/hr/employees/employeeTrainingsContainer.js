import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import EmployeeTrainings from 'components/modules/hr/employees/employeeTrainings';

class EmployeeTrainingsContainer extends Component {
    //TODO: Tutaj zapytania do API HR Worker
    render(){
        const {initialValues, changeVisibleDetails, action, handleClose, error, clearError, isLoading } = this.props;
        return(
            <EmployeeTrainings
                initialValues={initialValues}
                changeVisibleDetails={changeVisibleDetails}
                error={error}
                isLoading={isLoading}
                onClose={handleClose}
            />
        );
    };
};

EmployeeTrainingsContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    handleClose: PropTypes.func,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeTrainingsContainer);
