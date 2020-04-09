import React, { Component } from 'react';
import { withStyles, Grid, Divider }  from '@material-ui/core/';
import { Save, Cancel } from '@material-ui/icons/';
import * as constants from 'constants/uiNames';
import Spinner from 'common/spinner';
import ModalDialog from 'common/modalDialog';
import { Button, SearchField } from 'common/gui';
import PropTypes from 'prop-types';
import { FormTableField } from 'common/form';


const headPrivileges = [
    { id: 'code', numeric: false, disablePadding: false, label: constants.GROUP_PERMISSIONS_TABLE_PRIVILEGES_HEAD_ROW_CODE },
    { id: 'name', numeric: false, disablePadding: false, label: constants.GROUP_PERMISSIONS_TABLE_PRIVILEGES_HEAD_ROW_NAME },
];

const headObjects = [
    { id: 'name', numeric: false, disablePadding: false, label: constants.GROUP_PERMISSIONS_TABLE_OBJECTS_HEAD_ROW_NAME },
]

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(28)}px)`,
        overflow: 'auto',
        padding: 0,
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    container: {
        maxWidth: '100%',
        height: `calc(100vh - ${theme.spacing(30)}px)`,
    },
    tableWrapper: {
        overflow: 'auto',
        height: `calc(100vh - ${theme.spacing(39)}px)`,
    },
});


class GroupPermissionsForm extends Component {
    state = {
        acObjectNameSearch: '',
        privilegesCodeNameSearch: '',
        acObjects: [],
        allObjectPrivileges: [],
    }

    filter = (items, object) => {
        return items.filter((item) => {
            if( object === 'acObjectNameSearch'){
                return (
                    item.name.toLowerCase().search(
                    this.state.acObjectNameSearch.toLowerCase()) !== -1
                )
            } else if (object === 'privilegesCodeNameSearch'){
                return (
                    item.name.toLowerCase().search(
                        this.state.privilegesCodeNameSearch.toLowerCase()) !== -1 ||
                    item.code.toLowerCase().search(
                        this.state.privilegesCodeNameSearch.toLowerCase()) !== -1
                )
            }
            return item;
        });
    }

    handleChangeSearch = (event) => {
        this.setState({[event.target.id]: event.target.value})
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.selectedObject !== prevProps.selectedObject){
            if(this.props.selectedObject.length){ // selected AcObject
                this.props.handelAcObjectChanged(this.props.selectedObject);
                if(this.state.privilegesCodeNameSearch){
                    this.setState({
                        allObjectPrivileges: this.filter(this.props.selectedObject[0].privileges, 'privilegesCodeNameSearch'),
                    });
                } else {
                    this.setState({
                        allObjectPrivileges: this.props.selectedObject[0].privileges,
                    });
                }
            } else { // not selected AcObject, remove privileges
                this.setState({
                    allObjectPrivileges: [],
                });
            }
        } else if(this.props.acObjects !== prevProps.acObjects){
            this.setState({
                acObjects: this.props.acObjects,
                allObjectPrivileges: [],
            })
        } else if(this.state.acObjectNameSearch !== prevState.acObjectNameSearch){
            console.log(this.state.acObjects)
            this.setState({
                acObjects: this.filter(this.props.acObjects, 'acObjectNameSearch'),
                allObjectPrivileges:[],
            })
        } else if(this.state.privilegesCodeNameSearch !== prevState.privilegesCodeNameSearch){
            if(this.props.selectedObject.length){
                this.setState({
                    allObjectPrivileges: this.filter(this.props.selectedObject[0].privileges, 'privilegesCodeNameSearch'),
                })
            }
        }
    }

    render(){
        const { handleSubmit, pristine, submitting, invalid, submitSucceeded, classes, initialValues, error, onClose } = this.props;
        const { acObjects, allObjectPrivileges } = this.state;
        return(
            <>
                {error && <ModalDialog message={error} variant="error"/>}
                <form onSubmit={handleSubmit}>
                    { submitting && <Spinner /> }
                    <div className={classes.content}>
                        <Grid container spacing={1}
                            justify="center"
                            className={classes.container}
                            alignItems="flex-start"
                            direction="row"
                        >
                            <Grid item xs={12} sm={4}>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                >
                                    <Grid item xs={12} sm={12}>
                                        <SearchField
                                            name="acObjectNameSearch"
                                            onChange={this.handleChangeSearch}
                                            label={constants.GROUP_PERMISSIONS_SEARCH_AC_OBJECTS_NAME}
                                            placeholder={constants.GROUP_PERMISSIONS_SEARCH_AC_OBJECTS_NAME}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="permissions.acObjects"
                                            head={headObjects}
                                            allRows={acObjects}
                                            checkedRows={initialValues.permissions.acObjects}
                                            multiChecked={false}
                                            label={constants.GROUP_PERMISSIONS_TABLE_OBJECTS_LABEL}
                                            checkedColumnFirst={true}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                >
                                    <Grid item xs={12} sm={12}>
                                        <SearchField
                                            name="privilegesCodeNameSearch"
                                            onChange={this.handleChangeSearch}
                                            label={constants.GROUP_PERMISSIONS_SEARCH_PRIVILEGES_CODE_NAME}
                                            placeholder={constants.GROUP_PERMISSIONS_SEARCH_PRIVILEGES_CODE_NAME}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormTableField
                                            className={classes.tableWrapper}
                                            name="permissions.privileges"
                                            head={headPrivileges}
                                            allRows={allObjectPrivileges}
                                            checkedRows={initialValues.permissions.privileges}
                                            multiChecked={true}
                                            label={constants.GROUP_PERMISSIONS_TABLE_PRIVILEGES_LABEL}
                                            checkedColumnFirst={false}
                                            orderBy="code"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    <div>
                        <Divider />
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                        >
                            <Button
                                label={constants.BUTTON_SAVE}
                                icon=<Save className={classes.leftIcon}/>
                                iconAlign="left"
                                type='submit'
                                variant="submit"
                                disabled={pristine || submitting || invalid || submitSucceeded }
                            />
                            <Button
                                label={constants.BUTTON_CLOSE}
                                icon=<Cancel className={classes.leftIcon}/>
                                iconAlign="left"
                                variant="cancel"
                                onClick = {onClose}
                            />
                        </Grid>
                    </div>
                </form>
            </>
        );
    };
}

GroupPermissionsForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    error: PropTypes.string,
    classes: PropTypes.object,
};

export default withStyles(styles)(GroupPermissionsForm)