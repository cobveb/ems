import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import { Tabs, Tab, TabPanel } from 'common/gui';
import PropTypes from 'prop-types';
import { Info, Group, Security } from '@material-ui/icons/';
import GroupIcon from '@material-ui/icons/Group';
import ModalDialog from 'common/modalDialog';
import GroupBasicInfoFormContainer from 'containers/modules/administrator/groupBasicInfoFormContainer';
import GroupUsersFormContainer from 'containers/modules/administrator/groupUsersFormContainer';
import AcPermissionsFormContainer from 'containers/modules/administrator/acPermissionsFormContainer';
import * as constants from 'constants/uiNames';

const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
    },
});

class GroupDetails extends Component {
    state = {
        value: 0,
    };

    handleSubmitBasic = (values) => {
        this.props.handleSubmitBasic(values);
    }

    handleSubmitPrivileges = (values) => {
        this.props.handleSubmitPrivileges(values);
    }

    handleSubmitGroupUsers = (values) => {
        this.props.handleSubmitUsers(values);
    }

    handleChange = (event, value) => {
        this.setState({ value });
        if(value === 1){
            this.props.handleGroupPermissions()
        } else if (value === 2){
            this.props.handleGroupUsers(this.props.basicInfo.code);
        }
    };

    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    render(){
        const { classes, action, handleClose, basicInfo, users, allUsers, acObjects, permissions, handelAcObjectChanged, error } = this.props;
        const { value } = this.state;
        return (
            <>
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column" >
                    <div className={classes.root}>
                        <Typography variant="h6">Grupa - {action === "add" ? constants.GROUP_CREATE_NEW_GROUP : basicInfo.name}</Typography>
                        <Divider />

                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            variant="fullWidth"
                            scrollButtons="on"
                        >
                            <Tab label={constants.GROUP_BASIC_INFORMATION} icon={<Info />} index={0} />
                            <Tab label={constants.GROUP_PERMISSIONS} icon={<Security />} index={1} disabled={action==="add" || basicInfo.code ==="admin"}/>
                            <Tab label={constants.GROUP_USERS} icon={<GroupIcon />} index={2} disabled={action==="add"}/>
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <GroupBasicInfoFormContainer
                                initialValues={basicInfo}
                                onSubmit={this.handleSubmitBasic}
                                onClose={handleClose}
                                error = {error}
                                action={action}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <AcPermissionsFormContainer
                                acObjects={acObjects}
                                initialValues={permissions}
                                onSubmit={this.handleSubmitPrivileges}
                                handelAcObjectChanged={handelAcObjectChanged}
                                error = {error}
                                onClose={handleClose}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <GroupUsersFormContainer
                                initialValues={users}
                                onSubmit={this.handleSubmitGroupUsers}
                                allUsers={allUsers}
                                error = {error}
                                onClose={handleClose}
                            />
                        </TabPanel>
                    </div>
                </Grid>
            </>
        )
    }
}

Group.propTypes = {
    classes: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    allUsers: PropTypes.array.isRequired,
    acObjects: PropTypes.array.isRequired,
    basicInfo: PropTypes.array.isRequired,
    permissions: PropTypes.array.isRequired,
    changeVisibleDetails: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleGroupUsers: PropTypes.func.isRequired,
    handleGroupPermissions: PropTypes.func.isRequired,
    handelAcObjectChanged: PropTypes.func.isRequired,
    error: PropTypes.string,
    action: PropTypes.oneOf(['add', 'edit']).isRequired,
}

export default withStyles(styles) (GroupDetails);