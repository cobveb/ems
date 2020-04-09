import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as constants from 'constants/uiNames';
import { withStyles, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Toolbar, Tooltip, IconButton } from '@material-ui/core/';
import { Delete, AddCircle } from '@material-ui/icons/';

const styles = theme => ({
root: {
    width: '100%',
    overflow: 'auto',
  },
  table: {
      minWidth: 650,
  },
        spacer: {
            flex: '1 1 60%',
        },
        actions: {
            color: theme.palette.text.secondary,
        },
        title: {
            flex: '0 0 auto',
        },
});


class OrganizationUnitCoordinator extends Component {

    render(){
        const { classes } = this.props;
        return (
            <>

                <Toolbar>
                    <div>
                        <Typography variant="h6">Pozycje ze słownika grup asortymentowych</Typography>
                    </div>
                    <div className={classes.spacer} />
                    <div>
                        <Tooltip title="Delete">
                            <IconButton aria-label="Delete">
                                <AddCircle />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton aria-label="Delete">
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Grupa asortymentowa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Testowa Grupa asortymentowa</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Testowa Grupa asortymentowa</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Testowa Grupa asortymentowa</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Testowa Grupa asortymentowa</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </>
        )
    }
}

export default withStyles(styles) (OrganizationUnitCoordinator);