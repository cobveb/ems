import React, { Component } from 'react';
import { connect } from "react-redux";
import User from 'components/modules/administrator/user';
import AdministratorApi from 'api/modules/administrator/administratorApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import { Redirect } from 'react-router'

class UserContainer extends Component {
    state = {
        initData: {
            isActive: false,
            isLocked: false,
            isCredentialsExpired: false,
            isExpired: false,
            unit: "",
        },
        ous:[
            {
                code: "",
                name: constants.USER_BASIC_INFORMATION_OU,
                state: true
            }
        ],
        isEdit: false,
        redirect: false,
        action: this.props.match.params.action
    }

    handleGetOus(){
        this.props.loading(true);
        return AdministratorApi.getActiveOu()
        .then(response => {
            this.setState({
                ous: this.state.ous.concat(response.data.data),
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetUser(){
        this.props.loading(true);
        AdministratorApi.getUser(this.props.match.params.userId)
        .then(response => {
            this.setState(previousState => ({
                initData: response.data.data,
            }));
        })
        .catch(error => {});
    }

    handelSubmitSucceeded = (data) => {
        AdministratorApi.saveUser(data)
        .then(response => {
            this.setState({
                redirect: true,
            });
            this.props.loading(false)
        })
        .catch(error => {
            this.setState(previousState => ({
                initData: data,
            }));
        });
    }

    componentDidMount() {
        this.handleGetOus();
        if(this.state.action === "edit"){
            this.setState({
                isEdit: true,
            });
            this.handleGetUser();
        }
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {initData, isEdit, ous, redirect} = this.state;

        if (redirect === true) {
            return <Redirect to="/modules/administrator" />
        }

        return(
            <User
                initialValues = {initData}
                isLoading = {isLoading}
                error = {error}
                submitSucceeded={this.handelSubmitSucceeded}
                title={isEdit ? constants.USER_TITLE_EDIT + " " + initData.username : constants.USER_TITLE_ADD}
                edit = {isEdit}
                ous = {ous}
                clearError = {clearError}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);