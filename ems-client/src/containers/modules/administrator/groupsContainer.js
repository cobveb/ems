import React, { Component } from 'react';
import { connect } from "react-redux";
import Groups from 'components/modules/administrator/groups';
import GroupsApi from 'api/modules/administrator/groupsApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';

class GroupsContainer extends Component {
    state = {
        initData: [{
            basic: [],
            permissions: [],
            users: [],
        }],
    }

    handleAll(){
        this.props.loading(true);
        GroupsApi.getAllUserGroups()
        .then(response => {
            this.setState( prevState => {
                const initData = [{ ...prevState.initData[0]}];
                initData[0].basic = response.data.data;

                return { initData };
            })
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleUpdateOnCloseGroup(){
        this.handleAll();
    }

    handleDelete(code){
        this.props.loading(true);
        GroupsApi.deleteGroupUsers(code)
        .then(response => {
            this.setState( prevState => {
                const initData = [{ ...prevState.initData[0]}];
                initData[0].basic = initData[0].basic.filter(group => group.code !== code);
                return { initData };
            })
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleAll();
    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {initData} = this.state;
        return(
            <Groups
                initialValues = {initData}
                isLoading = {isLoading}
                error = {error}
                clearError = {clearError}
                onDelete={this.handleDelete.bind(this)}
                onCloseGroup={this.handleUpdateOnCloseGroup.bind(this)}
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


export default connect(mapStateToProps, mapDispatchToProps)(GroupsContainer);