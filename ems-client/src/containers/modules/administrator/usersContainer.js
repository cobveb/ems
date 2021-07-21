import React, { Component } from 'react';
import { connect } from "react-redux";
import Users from 'components/modules/administrator/users/users';
import UsersApi from 'api/modules/administrator/usersApi';
import OrganizationUnitsApi from 'api/modules/administrator/organizationUnitsApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import {updateOnCloseDetails} from 'utils';
import * as constants from 'constants/uiNames';

class UsersContainer extends Component {
    state = {
        initData: [],
        ous:[
            {
                code: "",
                name: constants.USER_BASIC_INFORMATION_OU,
                state: true
            }
        ],
    }

    handleGetOus(){
        return OrganizationUnitsApi.getActiveOu()
        .then(response => {
            this.setState({
                ous: this.state.ous.concat(response.data.data),
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleAll(){
        this.props.loading(true);
        UsersApi.getAllUsers()
        .then(response => {
            this.setState({
                initData: response.data.data,
            })
            this.handleGetOus();
        })
        .catch(error => {});
    }

    handleDelete(code){
        this.props.loading(true);
        UsersApi.deleteUser(code)
        .then(response => {
            let users = this.state.initData;
            users = users.filter(user => user.id !== code)
            this.setState({
                initData: users,
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleUpdateOnCloseUser = (user) => {
        let users = this.state.initData;
        return updateOnCloseDetails(users, user);
    }

    componentDidMount() {
        this.handleAll();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {initData, ous} = this.state;
        return(
            <Users
                initialValues = {initData}
                isLoading = {isLoading}
                ous={ous}
                error = {error}
                clearError = {clearError}
                onDelete={this.handleDelete.bind(this)}
                onClose={this.handleUpdateOnCloseUser.bind(this)}
                loading={loading}
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);