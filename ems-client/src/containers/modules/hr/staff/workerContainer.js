import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Worker from 'components/modules/hr/staff/worker';

class WorkerContainer extends Component {
    //TODO: Tutaj zapytania do API HR Worker
    render(){
        const {initialValues, changeVisibleDetails, action, changeAction, handleClose, error, clearError, isLoading, loading} = this.props;
        return(
            <Worker
                initialValues={initialValues}
                changeVisibleDetails={changeVisibleDetails}
                action={action}
                error={error}
                isLoading={isLoading}
                onClose={handleClose}
            />
        );
    };
};

WorkerContainer.propTypes = {
    initialValues: PropTypes.object,
    changeVisibleDetails: PropTypes.func,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    changeAction: PropTypes.func,
    handleClose: PropTypes.func,
    error: PropTypes.string,
    clearError: PropTypes.func,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
}

export default WorkerContainer;
