import React, { Component } from 'react';
import { connect } from "react-redux";
import { ClickAwayListener  } from '@material-ui/core/';
import { bindActionCreators } from 'redux';
import { loading } from 'actions/';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import Application from 'components/modules/applicant/applications/application';
import ApplicationsApi from 'api/modules/applicant/applicationsApi';
import {findCoordinator} from 'utils';

class ApplicationContainer extends Component {
    state = {
        initData: {
            number: null,
            status: null,
            createDate: null,
            sendDate: null,
            positions: [],
        },
        status: [
            {
                code: 'DO',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_ADDED,
            },
            {
                code: 'ZP',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_SAVED,
            },
            {
                code: 'WY',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_SENT,
            },
            {
                code: 'RO',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_CONSIDERED,
            },
            {
                code: 'ZA',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_APPROVED,
            },
            {
                code: 'RE',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_REALIZED,
            },
            {
                code: 'ZR',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_EXECUTED,
            },
            {
                code: 'OD',
                name: constants.APPLICATIONS_APPLICATION_POSITION_STATUS_REJECTED,
            },
        ]
    }


    handleUpdatePositions = (positions) => {
        positions.map(position => (
            Object.assign(position,
            {
                status: position.status =
                    this.state.status.find(status => {
                        return status.code === position.status
                    })
            })
        ))

        return positions;
    }

    handleGetApplicationPositions(){
        this.props.loading(true);
        return ApplicationsApi.getApplicationPositions(this.props.initialValues.id)
        .then(response =>{
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, this.props.initialValues)
                initData.coordinator = findCoordinator(this.props.coordinators, this.props.initialValues.coordinator.code);
                initData.positions = this.handleUpdatePositions(response.data.data);
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleSubmit = (values) => {
        if(this.props.action === 'add'){
            values.status = this.props.applicationsStatus.find(status => status.code === 'ZP');
        }
        const payload = JSON.parse(JSON.stringify(values));
        payload.status = values.status.code;
        if(payload.positions.length > 0 ){
            payload.positions.map(position => {
               return Object.assign(position, {status: position.status.code})
            })
        }
        ApplicationsApi.saveApplication(this.props.action, payload)
        .then(response => {
            this.props.changeAction("edit");
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data)
                initData.status = this.props.applicationsStatus.find(status => {
                    return status.code === response.data.data.status;
                });
                initData.coordinator = this.handleFindCoordinator(response.data.data.coordinator.code);
                initData.positions = this.handleUpdatePositions(initData.positions)
                return {initData};
            });
        })
        .catch(error => {
            this.setState({
                initData: values,
            });
        });
    }

    handleSend = () => {
        this.props.loading(true);
        ApplicationsApi.sendApplication(this.state.initData.id)
        .then(response => {
            this.setState(prevState => {
                let initData = {...prevState.initData};
                Object.assign(initData, response.data.data)
                initData.status = this.props.applicationsStatus.find(status => {
                    return status.code === response.data.data.status;
                });
                initData.coordinator = this.handleFindCoordinator(response.data.data.coordinator.code);
                initData.positions = this.handleUpdatePositions(initData.positions)
                return {initData};
            });
            this.props.loading(false);
        })
        .catch(error =>{});
    }

    handleClickAway = (event) => {
//        console.log("away")
//        console.log(event.target.value)
    }

    componentDidMount(){
        if(this.props.action === "edit"){
            this.handleGetApplicationPositions();
        }
    }

    render(){
        const { isLoading, action, handleClose, coordinators, units } = this.props;
        const { initData, status } = this.state;
        return(
            <ClickAwayListener onClickAway={this.handleClickAway}>
            <Application
                isLoading={isLoading}
                action={action}
                initData={initData}
                coordinators={coordinators}
                units={units}
                status={status}
                handleSubmit={this.handleSubmit}
                handleSend={this.handleSend}
                onClose={handleClose}
            />
            </ClickAwayListener>
        );
    };
}
ApplicationContainer.propTypes = {
    isLoading: PropTypes.bool,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    initialValues: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);