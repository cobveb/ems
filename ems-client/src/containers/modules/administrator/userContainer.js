import React, { Component } from 'react';
import { connect } from "react-redux";
import User from 'components/modules/administrator/users/user';
import AccessControlApi from 'api/modules/administrator/accessControlApi';
import GroupsApi from 'api/modules/administrator/groupsApi';
import UsersApi from 'api/modules/administrator/usersApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import * as constants from 'constants/uiNames';
import { findSelectFieldPosition } from 'utils/';
class UserContainer extends Component {
    state = {
        initData: {
            isActive: false,
            isLocked: false,
            isCredentialsExpired: false,
            isExpired: false,
            unit: "",
        },
        acObjects: [],
        permissions: {
            acObject : [],
            privileges : [],
        },
        allGroups: [],
        userGroups: [],
    }

    handleGetUser(){
        this.props.loading(true);
        UsersApi.getUser(this.props.initialValues.id)
        .then(response => {
            response.data.data.unit = findSelectFieldPosition(this.props.ous, response.data.data.unit.code)
            this.setState({
                initData: response.data.data,
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleSubmitBasic = (data) => {
        UsersApi.saveUser(data)
        .then(response => {
            response.data.data.unit = this.state.ous.find(ou => {
                return ou.code === response.data.data.unit.code
            });
            this.props.loading(false)
            this.setState(previousState => ({
                initData: response.data.data,
            }));
        })
        .catch(error => {
            this.setState({
                initData: data,
            });
        });
    }

    handleSubmitPermissions = (values) => {
        UsersApi.saveUserObjectPermissions(values.permissions.privileges, this.state.initData.username, values.permissions.acObject[0].id)
        .then(response => {
            this.setState( prevState => {
                let permissions = { ...prevState.permissions};
                permissions = values.permissions;
                return {permissions};
            });
        })
        .catch(error => {})
    }

    handleSubmitGroups = (values) => {
        UsersApi.saveUserGroups(values.groups, this.state.initData.username)
        .then(response => {
            this.setState({
                userGroups: values.groups,
            });
        })
        .catch(error => {})
    }

    handelAcObjectChanged = (AcObject) => {
        this.props.loading(true);
        UsersApi.getUserObjectPermission(this.state.initData.username, AcObject[0].id)
            .then(response => {
                let userPrivileges = [];
                response.data.data.map(privilege => {
                    return userPrivileges.push(
                        AcObject[0].privileges.find(item => {
                            return item.id === privilege.id;
                        })
                    )
                })
                this.setState( prevState => {
                    const permissions = { ...prevState.permissions};
                    permissions.acObject = AcObject;
                    permissions.privileges = userPrivileges;
                    return {permissions};
                });
                this.props.loading(false);
            })
            .catch(error => {})
    }

    handleUserPermissions = () => {
        this.props.loading(true);
        AccessControlApi.getAllAcObject()
            .then(response => {
                this.setState( prevState => {
                    let acObjects = { ...prevState.acObjects};
                    acObjects = response.data.data;
                    return {acObjects};
                });
                this.props.loading(false);
            })
            .catch(error => {})
    }

    handleUserGroups = (user) => {
        this.props.loading(true);
        UsersApi.getUserGroups(user.username)
        .then(response => {
            this.setState({
                userGroups: response.data.data,
            });
            GroupsApi.getAllUserGroups()
            .then(response => {
                this.setState({
                    allGroups: response.data.data,
                });
            })
            .catch(error => {});
                this.props.loading(false)
            })
        .catch(error => {});
    }

    componentDidMount() {
        if(this.props.action === "edit"){
            this.handleGetUser();
        }
    }

    render(){
        const {isLoading, error, clearError, action, ous, handleClose } = this.props;
        const {initData, acObjects, permissions, userGroups, allGroups} = this.state;
        return(
            <User
                isLoading = {isLoading}
                basicInfo = {initData}
                title={action === 'edit' ? constants.USER_TITLE_EDIT + " " + this.props.initialValues.username : constants.USER_TITLE_ADD}
                action = {action}
                ous = {ous}
                acObjects={acObjects}
                permissions = {{permissions: permissions}}
                userGroups={{groups: userGroups}}
                allGroups={allGroups}
                handleUserPermissions={this.handleUserPermissions}
                handleUserGroups={this.handleUserGroups}
                handelAcObjectChanged={this.handelAcObjectChanged}
                handleSubmitBasic={this.handleSubmitBasic}
                handleSubmitPermissions={this.handleSubmitPermissions}
                handleSubmitGroups={this.handleSubmitGroups}
                error = {error}
                clearError = {clearError}
                onClose={handleClose}
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