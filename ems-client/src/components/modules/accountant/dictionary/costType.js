import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import ModalDialog from 'common/modalDialog';
import Spinner from 'common/spinner';
import * as constants from 'constants/uiNames';
import PropTypes from 'prop-types';
import CostTypeFormContainer from 'containers/modules/accountant/dictionary/forms/costTypeFormContainer';

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
    },
});

class CostType extends Component {

    handleSubmit = (values) => {
        this.props.onSubmit(values);
    }

    handleClose = () =>{
        this.props.onClose();
    }

    render(){
        const { isLoading, classes, error, action, initialValues, coordinators } = this.props;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.root}>
                        <Typography variant="h6">
                            {action === "add" ?
                                constants.ACCOUNTANT_CREATE_COST_TYPE_TITLE :
                                    constants.ACCOUNTANT_EDIT_COST_TYPE_TITLE + ` ${initialValues.name}`
                            }
                        </Typography>
                        <Divider />
                        <CostTypeFormContainer
                            initialValues={initialValues}
                            coordinators={coordinators}
                            onSubmit={this.handleSubmit}
                            onClose={this.handleClose}
                            action={action}
                        />
                    </div>
                </Grid>
            </>
        );
    };

};

CostType.propType = {
    classes: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    initialValues: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
    coordinators: PropTypes.array,
};

export default withStyles(styles)(CostType);