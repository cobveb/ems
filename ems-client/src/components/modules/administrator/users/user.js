import React, { Component } from 'react';
import { withStyles, Grid, Typography, Divider } from '@material-ui/core/';
import UserFormContainer from 'containers/modules/administrator/userFormContainer';
import AcPermissionsFormContainer from 'containers/modules/administrator/acPermissionsFormContainer';
import UserGroupsFormContainer from 'containers/modules/administrator/userGroupsFormContainer';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';
import { Tabs, Tab, TabPanel } from 'common/gui';
import * as constants from 'constants/uiNames';
import { Info, Group, Security } from '@material-ui/icons/';


const styles = theme => ({
    root: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: `calc(100vh - ${theme.spacing(11)}px)`,
    },
});


class User extends Component {

    state = {
        numTab: 0,
    };

    handleSubmitBasic = (values) => {
        this.props.handleSubmitBasic(values);
    }

    handleSubmitPermissions = (values) => {
        this.props.handleSubmitPermissions(values);
    }

    handleSubmitGroups = (values) => {
        this.props.handleSubmitGroups(values);
    }

    handleCloseDialog = () =>{
        this.props.clearError(null);
    }

    handleChangeTabs = (event, numTab) => {
        this.setState({ numTab });
        if(numTab === 1){
            this.props.handleUserPermissions()
        } else if (numTab === 2){
            this.props.handleUserGroups(this.props.basicInfo);
        }
    };

    render(){
        const { classes, basicInfo, isLoading, error, title, action, ous, userGroups, allGroups, onClose, acObjects, permissions, handelAcObjectChanged } = this.props;
        const { numTab } = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                <Grid container spacing={0} direction="column">
                    <div className={classes.root}>
                        <Typography variant="h6">{title}</Typography>
                        <Divider />
                        <Tabs
                            value={numTab}
                            onChange={this.handleChangeTabs}
                            variant="fullWidth"
                            scrollButtons="on"
                        >
                            <Tab label={constants.USER_BASIC_INFORMATION} icon={<Info />} index={0} />
                            <Tab label={constants.USER_PERMISSIONS} icon={<Security />} index={1} disabled={action==="add"}/>
                            <Tab label={constants.USER_GROUPS} icon={<Group />} index={2} disabled={action==="add"}/>
                        </Tabs>
                        <TabPanel value={numTab} index={0}>
                            <UserFormContainer
                                onSubmit={this.handleSubmitBasic}
                                initialValues={basicInfo}
                                action={action}
                                ous={ous}
                                onClose={() => onClose(basicInfo)}
                            />
                        </TabPanel>
                        <TabPanel value={numTab} index={1}>
                            <AcPermissionsFormContainer
                                acObjects={acObjects}
                                initialValues={permissions}
                                onSubmit={this.handleSubmitPermissions}
                                handelAcObjectChanged={handelAcObjectChanged}
                                error = {error}
                                onClose={() => onClose(basicInfo)}
                            />
                        </TabPanel>
                        <TabPanel value={numTab} index={2}>
                            <UserGroupsFormContainer
                                initialValues={userGroups}
                                onSubmit={this.handleSubmitGroups}
                                allGroups={allGroups}
                                error = {error}
                                onClose={() => onClose(basicInfo)}
                            />
                        </TabPanel>
                    </div>
                </Grid>
            </>
        )
    }
}

export default withStyles(styles)(User);