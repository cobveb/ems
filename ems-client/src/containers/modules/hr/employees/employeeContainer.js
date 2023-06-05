import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { loading } from 'actions/';
import PropTypes from 'prop-types';
import Employee from 'components/modules/hr/employees/employee';
import EmployeeApi from 'api/modules/hr/employees/employeeApi';

class EmployeeContainer extends Component {

    state = {
        initData: this.props.initialValues,
        action: this.props.action,
    }

    handleSubmitBasic = (employee) => {
        EmployeeApi.saveEmployee(employee)
        .then(response => {
            this.props.loading(true)
            this.setState(prevState => {
                let initData = {...prevState.initData};
                let action = prevState.action;
                initData = response.data.data;
                action = "edit";

                return {initData, action}
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    render(){
        const { isLoading } = this.props;
        const { initData, action } = this.state;
        return(
            <Employee
                initialValues={initData}
                action={action}
                levelAccess={this.props.levelAccess}
                isLoading={isLoading}
                onSubmitBasic={this.handleSubmitBasic}
                onClose={this.props.onClose}
            />
        );
    };
};

EmployeeContainer.propTypes = {
    initialValues: PropTypes.object,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    levelAccess: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    isLoading: PropTypes.bool,
}


const mapStateToProps = (state) => {
	return {
		isLoading: state.ui.loading,
	}
};

function mapDispatchToProps (dispatch) {
    return {
        loading : bindActionCreators(loading, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeContainer);
