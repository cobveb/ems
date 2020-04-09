import React, { Component } from 'react';
import { connect } from "react-redux";
import Group from 'components/modules/administrator/group';
import GroupsApi from 'api/modules/administrator/groupsApi';
import UsersApi from 'api/modules/administrator/usersApi';
import AccessControlApi from 'api/modules/administrator/accessControlApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';

class GroupContainer extends Component {

    state = {
        initData: [{
            basic: [],
            acObjects: [],
            permissions: {
                acObjects : [],
                privileges : [],
            },
            users: '',
            allUsers: [],
        }],
        action: this.props.action,
    }

    handleSubmitBasic = (values) => {
        GroupsApi.saveGroupBasic(values)
        .then(response => {
            this.setState( prevState => {
                const initData = { ...prevState.initData};
                initData[0].basic = values;
                return {initData};
            });
            this.setState({
                action: "edit",
            })

        })
        .catch(error => {
            this.setState( prevState => {
                const initData = { ...prevState.initData};
                initData[0].basic = values;
                return {initData};
            });
        });
    }

    handleSubmitUsers = (values) => {
        GroupsApi.saveGroupUsers(values.users, this.state.initData[0].basic.code)
        .then(response => {
            this.setState( prevState => {
                const initData = { ...prevState.initData};
                initData[0].users = values.users;
                return {initData};
            });
        })
        .catch(error => {})
    }

    handleSubmitPrivileges = (values) => {
        console.log(values)
        GroupsApi.saveGroupObjectPermissions(values.permissions.privileges, this.state.initData[0].basic.code, values.permissions.acObjects[0].id)
        .then(response => {
            this.setState( prevState => {
                const initData = { ...prevState.initData};
                initData[0].permissions = values.permissions;
                return {initData};
            });
        })
        .catch(error => {})
    }

    handleGroupUsers(group){
        this.props.loading(true);
        GroupsApi.getGroupUsers(group)
        .then(response => {
            this.setState( prevState => {
                const initData = { ...prevState.initData};
                initData[0].users = response.data.data;
                return { initData };
            })
            UsersApi.getAllUsers()
                .then(response => {
                    this.setState( prevState => {
                        const initData = { ...prevState.initData};
                        initData[0].allUsers = response.data.data;
                        return { initData };
                    })
                })
                .catch(error => {});
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGroupPermissions(){
        this.props.loading(true);
        AccessControlApi.getAllAcObject()
            .then(response => {
                this.setState( prevState => {
                    const initData = { ...prevState.initData};
                    initData[0].acObjects = response.data.data;
                    return {initData};
                });
                this.props.loading(false);
            })
            .catch(error => {})
    }

    handelAcObjectChanged(AcObject){
        this.props.loading(true);
        GroupsApi.getGroupObjectPermission(this.state.initData[0].basic.code, AcObject[0].id)
            .then(response => {
                let groupPrivileges = [];
                response.data.data.map(privilege => {
                    return groupPrivileges.push(
                        AcObject[0].privileges.find(item => {
                            return item.id === privilege.id;
                        })
                    )
                })
                this.setState( prevState => {
                    const initData = { ...prevState.initData};
                    initData[0].permissions.acObjects = AcObject;
                    initData[0].permissions.privileges = groupPrivileges;
                    return {initData};
                });
                this.props.loading(false);
            })
            .catch(error => {})
    }

    componentDidMount(){
        this.props.loading(true);
        this.setState( prevState => {
            const initData = { ...prevState.initData};
            initData[0].basic = this.props.initialValues;
            return {initData};
        });

        this.props.loading(false)
    }

    render(){
        const {changeVisibleDetails, handleClose, error, clearError} = this.props;
        const {initData, action} = this.state;
        return(
            <Group
                initialValues = {initData}
                basicInfo = {initData[0].basic}
                users={{users: initData[0].users}}
                allUsers={initData[0].allUsers}
                acObjects={initData[0].acObjects}
                permissions = {{permissions: initData[0].permissions}}
                changeVisibleDetails = {changeVisibleDetails}
                action={action}
                handleClose={handleClose}
                handleGroupUsers={this.handleGroupUsers.bind(this)}
                handleGroupPermissions={this.handleGroupPermissions.bind(this)}
                handleSubmitBasic={this.handleSubmitBasic}
                handleSubmitPrivileges={this.handleSubmitPrivileges}
                handleSubmitUsers={this.handleSubmitUsers}
                handelAcObjectChanged={this.handelAcObjectChanged.bind(this)}
                error = {error}
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


export default connect(mapStateToProps, mapDispatchToProps)(GroupContainer);