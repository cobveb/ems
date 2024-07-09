import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Button, SearchField, SelectField, Checkbox } from 'common/gui';
import { TablePageable } from 'containers/common/gui';
import { Spinner, ModalDialog } from 'common/';
import RegisterContainer from 'containers/modules/asi/dictionary/registers/registerContainer';
import { setChangedSearchConditions } from 'utils/';

const styles = theme => ({
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
})

class Registers extends Component {
    state = {
        selected: {},
        rows: this.props.initialValues,
        register: '',
        entitlementSystem: '',
        employee: '',
        isDetailsVisible: false,
        action: null,
        searchConditionsChange: false,
        inactive: false,
        headCells: [
            {
                id: 'register',
                label: constants.ASI_REGISTERS_REGISTER,
                type: 'text',
            },
            {
                id: 'employee',
                label: constants.ASI_REGISTERS_REGISTER_TABLE_HEAD_ROW_EMPLOYEE,
                type: 'text',
            },
            {
                id: 'username',
                label: constants.USERNAME,
                type: 'text',
            },
            {
                id: 'entitlementSystem',
                label: constants.ASI_REGISTERS_REGISTER_ENTITLEMENT_SYSTEM,
                type: 'text',
            },
            {
                id: 'entitlementSystemPermission',
                label: constants.ASI_REGISTERS_REGISTER_TABLE_HEAD_ROW_PERMISSIONS,
                type: 'text',
            },
        ],
        searchConditions: [
            {
                name: 'register',
                value: '',
                type: 'select'
            },
            {
                name: 'entitlementSystem',
                value: '',
                type: 'select'
            },
            {
                name: 'employee',
                value: '',
                type: 'text'
            },
            {
                name: 'inactive',
                value: false,
                type: 'boolean'
            },
        ]
    }

    handleSearch = (event) => {
        if(event.target.name === 'inactive'){
            this.setState({
                inactive: event.target.checked,
            });
        } else {
            this.setState({[event.target.name]: event.target.value})
        }
        if(!['employee'].includes(event.target.name)){
            this.onChangeSearchConditions(event);
        }
    }

    handleBlur = (event) => {
        this.onChangeSearchConditions(event);
    }

    handleKeyDown = (event) => {
       if (event.key === "Enter") {
          this.onChangeSearchConditions(event);
       }
    }

    onChangeSearchConditions = (event) => {
        event.persist();
        this.setState(prevState => {
            const searchConditions = [...prevState.searchConditions];
            let searchConditionsChange = prevState.searchConditionsChange;
            return setChangedSearchConditions(event.target.name, event.target.name === "inactive" ? event.target.checked : event.target.value, searchConditions, searchConditionsChange);
        });
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleChangeVisibleDetails = (event, action) =>{
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible, action: action}));
    }

    handleCloseDetails = (isRegMod) => {
        this.setState(state => ({
            isDetailsVisible: !state.isDetailsVisible,
            action: null,
            selected: {},
        }));
        if(isRegMod){
            this.props.onClose(isRegMod);
        }
    };

    handleDelete = (event, action) => {
        this.setState(state => ({ action: action}));
    }

    handleCloseDialog = () =>{
        if(this.props.error !== null){
            this.props.clearError(null);
        }
        this.setState(state => ({
                action: null,
            })
        );
    }

    handleConfirmDelete = () => {
        this.props.onDelete(this.state.selected);
        this.setState({
            action: null,
            selected: {},
        });
    }

    handleExcelExport = (exportType) =>{
        this.props.onExcelExport(exportType, this.state.headCells);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.props.initialValues,
            });
        }

        if(this.state.searchConditionsChange){
            this.setState({
                searchConditionsChange: false,
                selected: {},
                action: ''
            })
            this.props.onSetSearchConditions(this.state.searchConditions);
        }
    }

    componentDidMount() {
        this.setState({rows: this.props.initialValues});
        this.props.onSetSearchConditions(this.state.searchConditions);
    }

    render(){
        const {classes, isLoading, error, registers, entitlementSystems } = this.props;
        const {selected, rows, register, entitlementSystem, employee, headCells, action, isDetailsVisible, searchConditionsChange, inactive} = this.state;
        return(
            <>
                {isLoading && <Spinner />}
                {action === "delete" &&
                    <ModalDialog
                        message={constants.ASI_DICTIONARY_REGISTER_DELETE_MSG}
                        variant="confirm"
                        onConfirm={this.handleConfirmDelete}
                        onClose={this.handleCloseDialog}
                    />
                }
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                {isDetailsVisible ?
                    <RegisterContainer
                        initialValues={action === 'add' ? {isActive: true} : selected}
                        action={action}
                        onClose={this.handleCloseDetails}
                    />
                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                        >
                            <Typography variant="h6">{constants.ASI_MENU_DICTIONARY_REGISTERS}</Typography>
                            <Divider />
                            <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={4}>
                                    <SelectField
                                        name="register"
                                        onChange={this.handleSearch}
                                        label={constants.ASI_REGISTERS_REGISTER}
                                        isRequired={true}
                                        options={registers}
                                        value={register}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <SelectField
                                        name="entitlementSystem"
                                        onChange={this.handleSearch}
                                        label={constants.ASI_REGISTERS_REGISTER_ENTITLEMENT_SYSTEM}
                                        options={entitlementSystems}
                                        value={entitlementSystem}
                                        disabled={register.length<1}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <SearchField
                                        name="employee"
                                        onChange={this.handleSearch}
                                        onBlur={this.handleBlur}
                                        onKeyDown={this.handleKeyDown}
                                        label={constants.ASI_REGISTERS_REGISTER_TABLE_HEAD_ROW_EMPLOYEE}
                                        valueType="all"
                                        value={employee}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Checkbox
                                        label={constants.STRUCTURE_SHOW_INACTIVE}
                                        labelPlacement="start"
                                        onChange={this.handleSearch}
                                        checked={inactive}
                                        name="inactive"
                                    />
                                </Grid>
                            </Grid>
                            <TablePageable
                                className={classes.tableWrapper}
                                rows={rows}
                                headCells={headCells}
                                onSelect={this.handleSelect}
                                onDoubleClick={()=>{}}
                                onExcelExport={this.handleExcelExport}
                                resetPageableProperties={searchConditionsChange}
                                defaultOrderBy="name"
                                rowKey="id"
                                orderBy={headCells[2]}
                            />
                        </Grid>
                       {/*
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                        >
                            <Grid item xs={12}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                >
                                    <Button
                                        label={constants.BUTTON_ADD}
                                        icon=<Add className={classes.icon}/>
                                        iconAlign="right"
                                        variant="add"
                                        onClick = { (event) => this.handleChangeVisibleDetails(event, 'add', )}
                                    />
                                    <Button
                                        label={constants.BUTTON_EDIT}
                                        icon=<Edit className={classes.icon}/>
                                        iconAlign="right"
                                        disabled={Object.keys(selected).length === 0}
                                        variant="edit"
                                        onClick = { (event) => this.handleChangeVisibleDetails(event, 'edit', )}
                                    />
                                    <Button
                                        label={constants.BUTTON_DELETE}
                                        icon=<Delete className={classes.icon}/>
                                        iconAlign="right"
                                        disabled={Object.keys(selected).length === 0}
                                        onClick = {(event) => this.handleDelete(event, 'delete', )}
                                        variant="delete"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        */}
                    </>
                }
            </>
        )
    }

}


Registers.propType = {
    classes: PropTypes.func.isRequired,
    initialValues: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isLoading,
    error: PropTypes.string,
    clearError: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onExcelExport: PropTypes.func.isRequired,
}

export default withStyles(styles)(Registers);