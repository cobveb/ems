import React, { Component } from 'react';
import { connect } from "react-redux";
import EntitlementSystemFormContainer from 'containers/modules/asi/dictionary/employees/forms/entitlementSystemFormContainer';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import EntitlementSystemApi from 'api/modules/asi/dictionary/employee/entitlementSystemApi';
import { findIndexElement } from 'utils';

class EntitlementSystemContainer extends Component {

    state ={
        initData: {
            permissions: [],
        },
        action: this.props.action,
    }

    handleSubmitSystem = (values) => {
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values));
        EntitlementSystemApi.saveEntitlementSystem(payload)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                let action = prevState.action;
                Object.assign(initData,response.data.data);
                action = "edit";
                return {initData, action}
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleGetSystemPermissions(){
        this.props.loading(true);
        EntitlementSystemApi.getEntitlementSystemPermissions(this.state.initData.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData}
                initData.permissions = response.data.data;
                return {initData};
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }


    handleSubmitSystemPermission = (values, action) =>{
        this.props.loading(true);
        const payload = JSON.parse(JSON.stringify(values));
        EntitlementSystemApi.saveEntitlementSystemPermission(this.state.initData.id, payload)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                if(action === "add"){
                    initData.permissions.push(response.data.data)
                } else {
                    const idx = findIndexElement(response.data.data, initData.permissions);
                    if(idx !== null){
                        initData.permissions.splice(idx, 1, response.data.data);
                    }
                }
                return {initData}
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleDeleteSystemPermission = (permission) => {
        this.props.loading(true);
        EntitlementSystemApi.deleteEntitlementSystemPermission(this.state.initData.id,  permission.id)
        .then(response => {
            this.setState(prevState => {
                const initData = {...prevState.initData};
                const idx = findIndexElement(permission, initData.permissions);
                if(idx !== null){
                    initData.permissions.splice(idx, 1);
                }
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidUpdate(prevProps){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                initData: Object.assign(this.state.initData,this.props.initialValues),
            });
        }
    }

    componentDidMount(){
        this.setState({
            initData: Object.assign(this.state.initData,this.props.initialValues),
        });
        if(this.state.action !== "add"){
            this.handleGetSystemPermissions();
        }
    }

    render(){
        return(
            <EntitlementSystemFormContainer
                initialValues={this.state.initData}
                action = {this.state.action}
                isLoading={this.props.isLoading}
                error={this.props.error}
                clearError={this.props.clearError}
                onSubmit={this.handleSubmitSystem}
                onSubmitPermission={this.handleSubmitSystemPermission}
                onDeletePermission={this.handleDeleteSystemPermission}
                onClose={this.props.onClose}
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
        loading : bindActionCreators(loading, dispatch),
        clearError : bindActionCreators(setError, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EntitlementSystemContainer);