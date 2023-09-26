import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Backdrop, CircularProgress, Dialog, Fab, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from 'react';
import { projectConverter } from '../converters/project.converter';
import { useCollection } from "../hooks/collection.hook";
import { CREATE_MODE, EDIT_MODE, MODE } from '../lib/util';
import { PROJECT_COLLECTION, Project } from '../model/project.model';
import { EditProject } from './EditProject';

export const ProjectList = () => {
    const [values, refresh, loading] = useCollection<Project>(PROJECT_COLLECTION, projectConverter)
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
                Project List
            </Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map(project => <TableRow>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(project.id)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item alignSelf='flex-end'>
            <Fab sx={{ pr: 2 }} onClick={() => setOpen({ open: true, mode: CREATE_MODE, id: '' })} variant="extended" size="small" color="primary" aria-label="add">
                <AddIcon sx={{ mr: 1 }} />
                Project
            </Fab>
        </Grid>
        <Dialog open={open.open} onClose={() => setOpen(curr => ({ ...curr, open: false }))}>
            <EditProject mode={open.mode} id={open.id} onSuccessfullSave={onSave}></EditProject>
        </Dialog>
    </Grid>
}

export const PROJECT_LIST_ROUTE = '/projectList'
