import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import { Delete, Add, Edit } from '@material-ui/icons/';
import { Button, SearchField } from 'common/gui';
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
        name: '',
        isDetailsVisible: false,
        action: null,
        searchConditionsChange: false,
        headCells: [
            {
                id: 'name',
                label: constants.TABLE_HEAD_ROW_NAME,
                type: 'text',
            },
            {
                id: 'isActive',
                label: constants.USER_TABLE_HEAD_ROW_ACTIVE,
                type: 'boolean',
            },
        ],
        searchConditions: [
            {
                name: 'name',
                value: '',
                type: 'text'
            },
        ]
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
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
            return setChangedSearchConditions(event.target.name, event.target.value, searchConditions, searchConditionsChange);
        });
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleDoubleClick = (row) => {
        this.setState({
            selected: row,
            isDetailsVisible: !this.state.isDetailsVisible,
            action: 'edit',
        });
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
    }

    render(){
        const {classes, isLoading, error } = this.props;
        const {selected, rows, name, headCells, action, isDetailsVisible, searchConditionsChange} = this.state;
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
                            <Grid container spacing={1} direction="row">
                                <Grid item xs={12}>
                                    <SearchField
                                        name="name"
                                        onChange={this.handleSearch}
                                        onBlur={this.handleBlur}
                                        onKeyDown={(e) => this.handleKeyDown(e)}
                                        label={constants.SEARCH_NAME}
                                        placeholder={constants.SEARCH_NAME}
                                        valueType='all'
                                        value={name}
                                    />
                                </Grid>
                            </Grid>
                            <TablePageable
                                className={classes.tableWrapper}
                                rows={rows}
                                headCells={headCells}
                                onSelect={this.handleSelect}
                                onDoubleClick={this.handleDoubleClick}
                                onExcelExport={this.handleExcelExport}
                                defaultOrderBy="name"
                                rowKey="id"
                                orderBy={headCells[0]}
                            />
                        </Grid>
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