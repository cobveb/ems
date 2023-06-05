import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import PropTypes from 'prop-types';
import Employees from 'components/modules/hr/employees/employees';
import EmployeeApi from 'api/modules/hr/employees/employeeApi';
import { updateOnCloseDetails, findIndexElement } from 'utils';

class EmployeesContainer extends Component {
    state = {
        employees: [],
    };

    handleGetEmployees(){
        this.props.loading(true);
        EmployeeApi.getEmployees()
        .then(response => {
            this.setState({
                employees: response.data.data,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleDelete = (employee) => {
        this.props.loading(true);
        EmployeeApi.deleteEmployee(employee.id)
        .then(response => {
            this.setState(prevState => {
                const employees = [...prevState.employees];
                const idx = findIndexElement(employee, employees);
                if(idx !== null){
                    employees.splice(idx, 1);
                }
                return {employees};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdateOnClose = (employee) => {
        let employees = this.state.employees;
        return updateOnCloseDetails(employees, employee, "id");
    }

    componentDidMount() {
        this.handleGetEmployees();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {employees} = this.state;
        return(
            <Employees
                initialValues={employees}
                levelAccess={this.props.levelAccess}
                isLoading={isLoading}
                error={error}
                clearError={clearError}
                onDelete={this.handleDelete}
                onClose={this.handleUpdateOnClose}
            />
        );
    };
};

EmployeesContainer.propTypes = {
    isLoading: PropTypes.bool,
    levelAccess: PropTypes.string.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesContainer);
