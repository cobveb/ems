import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Grid, Typography, Divider} from '@material-ui/core/';
import * as constants from 'constants/uiNames';
import { Spinner, ModalDialog } from 'common/';
import { Visibility } from '@material-ui/icons/';
import { Table, Button, SearchField } from 'common/gui';
import RegisterContainer from 'containers/modules/iod/registers/registerContainer';

const styles = theme => ({
    content: {
        height: `calc(100vh - ${theme.spacing(18.2)}px)`,
        overflow: 'auto',
        padding: 0,
        maxWidth: '100%',
    },
    container: {
        width: '100%',
        padding: 0,
        margin: 0,
    },
    containerBtn: {
        width: '100%',
        paddingLeft: theme.spacing(35),
        margin: 0,
    },
    tableWrapper: {
        minHeight: `calc(100vh - ${theme.spacing(32)}px)`,
    },
    item: {
        paddingRight: theme.spacing(1),
    },
})

class Registers extends Component {
    state = {
        rows: [],
        headCells: [
            {
                id: 'code',
                label: constants.IOD_REGISTERS_TABLE_HEAD_ROW_CODE,
                type:'text',
            },
            {
                id: 'name',
                label: constants.IOD_REGISTERS_TABLE_HEAD_ROW_NAME,
                type:'text',
            },
        ],
        isDetailsVisible: false,
        selected: null,
        search: '',
    }

    handleSelect = (id) => {
        this.setState({selected: id});
    }

    handleSearch = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleChangeVisibleDetails = () => {
        this.setState(state => ({isDetailsVisible: !state.isDetailsVisible}));
    }

    handleDoubleClick = (id) => {
        this.setState({
            selected: id,
            isDetailsVisible: !this.state.isDetailsVisible,
        });
    }

    filter = () => {
        let registers = this.props.initialValues;
        return registers.filter((register) => {
            return register.code.toLowerCase().search(
                    this.state.search.toLowerCase()) !== -1 &&
                register.name.toLowerCase().search(
                    this.state.search.toLowerCase()) !== -1
        })
    }

    handleCloseDialog = () => {
        this.props.clearError(null);
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.initialValues !== prevProps.initialValues){
            this.setState({
                rows: this.filter(),
            });
        }
        if (this.state.search !== prevState.search){
            this.setState({
                rows: this.filter(),
            })
        }
    }

    componentDidMount() {
        this.setState({rows: this.props.initialValues});
    }

    render() {
        const { classes, isLoading, error } = this.props;
        const { selected, isDetailsVisible, rows, headCells } = this.state;
        return (
            <>
                {isLoading && <Spinner />}
                {error && <ModalDialog message={error} onClose={this.handleCloseDialog} variant="error"/>}
                { isDetailsVisible ?
                    <RegisterContainer
                        initialValues={selected}
                        onClose={this.handleChangeVisibleDetails}
                    />
                :
                    <>
                        <Grid
                            container
                            direction="column"
                            spacing={0}
                        >
                            <Typography variant="h6">{constants.IOD_MENU_REGISTERS}</Typography>
                            <Divider />
                            <div className={classes.content}>
                                <Grid item xs={12}>
                                    <SearchField
                                        name="search"
                                        label={constants.DICTIONARIES_SEARCH_CODE_NAME}
                                        placeholder={constants.DICTIONARIES_SEARCH_CODE_NAME}
                                        onChange={this.handleSearch}
                                    />
                                </Grid>
                                <Grid container spacing={0} direction="row" justify="flex-start" className={classes.container}>
                                    <Table
                                        className={classes.tableWrapper}
                                        rows={rows}
                                        headCells={headCells}
                                        onSelect={this.handleSelect}
                                        onDoubleClick={this.handleDoubleClick}
                                        onExcelExport={this.handleExcelExport}
                                        rowKey="id"
                                    />
                                </Grid>
                            </div>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="flex-start"
                            className={classes.container}
                            spacing={0}
                        >
                                <Button
                                    label={constants.BUTTON_PREVIEW}
                                    icon=<Visibility />
                                    iconAlign="right"
                                    variant="cancel"
                                    disabled={!selected}
                                    onClick={this.handleChangeVisibleDetails}
                                />
                        </Grid>
                    </>
                }
            </>
        )
    }
}

Registers.propTypes = {
	classes: PropTypes.object.isRequired,
	initialValues: PropTypes.array.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
    clearError: PropTypes.func,
};

export default withStyles(styles)(Registers);