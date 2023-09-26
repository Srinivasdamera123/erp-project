import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Backdrop, Box, CircularProgress, Collapse, Dialog, Fab, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from 'react';
import { contractorConverter } from '../converters/contractor.converter';
import { useCollection } from "../hooks/collection.hook";
import { CREATE_MODE, EDIT_MODE, MODE } from '../lib/util';
import { CONTRACTOR_COLLECTION, Contractor } from '../model/contractor.model';
import { EditContractor } from './EditContractor';

export const ContractorList = () => {
    const [values, refresh, loading] = useCollection<Contractor>(CONTRACTOR_COLLECTION, contractorConverter)
    const [open, setOpen] = useState<{ open: boolean, mode: MODE, id: string }>({ open: false, mode: CREATE_MODE, id: '' });
    const onSave = () => { setOpen(curr => ({ ...curr, open: false })); refresh(); }
    const onEdit = (id: string) => {
        setOpen({ open: true, mode: EDIT_MODE, id })
    }
    if (loading) {
        return <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
        </Backdrop>
    }
    return <Grid spacing={2} sx={{ minHeight: '100%' }} justifyContent='space-between' container direction='column'>
        <Grid item>
            <Typography component="h2" variant="h4" align="center" gutterBottom>
                Contractor List
            </Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Remaining Amount</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map(contractor => <CollapsibleRow onEdit={() => onEdit(contractor.id)} key={contractor.id} contractor={contractor}></CollapsibleRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item alignSelf='flex-end'>
            <Fab sx={{ pr: 2 }} onClick={() => setOpen({ open: true, mode: CREATE_MODE, id: '' })} variant="extended" size="small" color="primary" aria-label="add">
                <AddIcon sx={{ mr: 1 }} />
                Contractor
            </Fab>
        </Grid>
        <Dialog open={open.open} onClose={() => setOpen(curr => ({ ...curr, open: false }))}>
            <EditContractor mode={open.mode} id={open.id} onSuccessfullSave={onSave}></EditContractor>
        </Dialog>
    </Grid>
}

const CollapsibleRow = ({ contractor, onEdit }: { contractor: Contractor, onEdit: () => any }) => {
    const [open, setOpen] = useState(false)
    return <>
        <TableRow>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell>{contractor.name}</TableCell>
            <TableCell>{contractor.project.name}</TableCell>
            <TableCell>{contractor.totalAmount}</TableCell>
            <TableCell>{contractor.remainingAmount}</TableCell>
            <TableCell>
                <IconButton onClick={onEdit}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Transactions
                        </Typography>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contractor.transactions?.map((transaction, index) => <TableRow key={index}>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>{transaction.amount}</TableCell>
                                    <TableCell>{transaction.date.toDate().toDateString()}</TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

export const CONTRACTOR_LIST_ROUTE = '/contractorList'
