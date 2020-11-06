import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import ApplicationFormContainer from 'containers/modules/applicant/applicationFormContainer';

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
    },
});

class Application extends Component {

    state = {
        positions: [],
    }

    handlePositions = (positions) => {
        this.setState({
            positions: positions,
        });
    }

    handleSubmit = (values) => {
        this.props.handleSubmit(values);
    }

    handleSend = () => {
        this.props.handleSend();
    }

    render(){
        const {classes, action, initData, coordinators, units, status, onClose } = this.props
        return(
            <>
                <Grid container spacing={0} direction="column">
                    <div className={classes.root}>
                        <Typography
                            variant="h6"
                        >
                            { action === "add" ?
                                constants.APPLICATION_CREATE_NEW_APPLICATION_TITLE
                                    : initData.status !== null && initData.status.code === 'ZP' ?
                                        constants.APPLICATION_EDIT_APPLICATION_TITLE + ` ${initData.number}`
                                            : constants.APPLICATION_VIEW_APPLICATION_TITLE + ` ${initData.number}`
                            }
                        </Typography>
                        <Divider />
                        <ApplicationFormContainer
                            initialValues={initData}
                            handlePositions={this.handlePositions}
                            coordinators={coordinators}
                            units={units}
                            status={status}
                            onClose={() => onClose(initData)}
                            onSubmit={this.handleSubmit}
                            onSend={this.handleSend}
                        />
                    </div>
                </Grid>
            </>
        );
    };
}

Application.propTypes = {
    classes: PropTypes.object.isRequired,
//    initData: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    error: PropTypes.string,
    status: PropTypes.array,
    coordinators: PropTypes.array,
    units: PropTypes.array,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
}


export default withStyles(styles)(Application);