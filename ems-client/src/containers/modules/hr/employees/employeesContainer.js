import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading, setError, resetSearchConditions, setPageableTableProperties, setConditions } from 'actions/';
import PropTypes from 'prop-types';
import Employees from 'components/modules/hr/employees/employees';
import EmployeeApi from 'api/modules/hr/employees/employeeApi';
import { findIndexElement, generateExportLink } from 'utils';

class EmployeesContainer extends Component {
    state = {
        employees: [],
    };

    handleGetEmployeesPageable(){
        this.props.loading(true);
        EmployeeApi.getEmployeesPageable(this.props.searchConditions)
        .then(response => {
            this.props.setPageableTableProperties({
                totalElements: response.data.data.totalElements,
                lastPage: response.data.data.last,
                firstPage: response.data.data.first,
            })
            this.setState({
                employees: response.data.data.content,
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

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        EmployeeApi.exportEmployeesToExcel(exportType, headRow, this.props.searchConditions)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidUpdate(prevProps){
        if(this.props.searchConditions !== prevProps.searchConditions){
            this.handleGetEmployeesPageable();
        }
    }

    componentWillUnmount(){
        this.props.resetSearchConditions();
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
                onSetSearchConditions={this.props.onSetSearchConditions}
                onExcelExport={this.handleExcelExport}
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
    	searchConditions: state.search,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
        resetSearchConditions : bindActionCreators(resetSearchConditions, dispatch),
        onSetSearchConditions : bindActionCreators(setConditions, dispatch),
        setPageableTableProperties : bindActionCreators(setPageableTableProperties, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesContainer);
