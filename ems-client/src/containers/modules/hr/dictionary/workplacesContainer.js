import React, { Component } from 'react';
import { connect } from "react-redux";
import Workplaces from 'components/modules/hr/dictionary/workplaces';
import WorkplacesApi from 'api/modules/hr/dictionary/workplacesApi';
import { bindActionCreators } from 'redux';
import { loading, setError } from 'actions/';
import { updateOnCloseDetails, findSelectFieldPosition, generateExportLink, findIndexElement } from 'utils';
import DictionaryApi from 'api/common/dictionaryApi';
import * as constants from 'constants/uiNames';

class WorkplacesContainer extends Component {
    state = {
        workplaces:[],
        groups:[
            {
                code: '',
                name: constants.HR_WORKPLACE_SEARCH_GROUP,
            },
        ],
    }

    handleGetWorkplaces(){
        WorkplacesApi.getAllWorkplaces()
        .then(response => {
            this.setState(prevState => {
                let workplaces = [...prevState.workplaces];
                workplaces = response.data.data;
                workplaces.map(workplace => (
                    Object.assign(workplace,
                        {
                            group: workplace.group = findSelectFieldPosition(this.state.groups, workplace.group.code),
                        }
                    )
                ))
                return {workplaces};
            });
            this.props.loading(false)
        })
        .catch(error => {});
    }

    handleGetGroups = () =>{
        this.props.loading(true);
        return DictionaryApi.getDictionaryActiveItems('slHrGrZaw')
        .then(response => {
            this.setState({
                groups: this.state.groups.concat(response.data.data),
            })
            this.handleGetWorkplaces();
        })
        .catch(error => {});
    }

    handleUpdateOnClose = (workplace) => {
        let workplaces = this.state.workplaces;
        return updateOnCloseDetails(workplaces, workplace);
    }

    handleDelete = (workplace) => {
        this.props.loading(true);
        WorkplacesApi.deleteWorkplace(workplace.id)
        .then(response => {
            this.setState(prevState => {
                const workplaces = [...prevState.workplaces];
                const idx = findIndexElement(workplace, workplaces);
                if(idx !== null){
                    workplaces.splice(idx, 1);
                }
                return {workplaces};
            });
            this.props.loading(false);
        })
        .catch(error => {});
    }

    handleExcelExport = (exportType, headRow) =>{
        this.props.loading(true);
        WorkplacesApi.exportPlacesToExcel(exportType, headRow)
        .then(response => {
            generateExportLink(response);
            this.props.loading(false);
        })
        .catch(error => {});
    }

    componentDidMount() {
        this.handleGetGroups();

    }

    render(){
        const {isLoading, error, clearError} = this.props;
        const {workplaces, groups} = this.state;
        return(
            <Workplaces
                initialValues = {workplaces}
                groups = {groups}
                isLoading = {isLoading}
                error = {error}
                clearError={clearError}
                onClose={this.handleUpdateOnClose}
                onDelete={this.handleDelete}
                onExcelExport={this.handleExcelExport}
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkplacesContainer);