import EditIcon from '@mui/icons-material/Edit'
import { Backdrop, CircularProgress, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import { DownloadIcon } from '../components/common/DownloadIcon'
import { employeeConverter } from "../converters/employee.converter"
import { useCollection } from "../hooks/collection.hook"
import { EMPLOYEE_COLLECTION, Employee } from "../model/employee.model"
import { EDIT_EMPLOYEE_ROUTE } from './EditEmployee'


export const EmployeeList = () => {
    const [values, _, loading] = useCollection<Employee>(EMPLOYEE_COLLECTION, employeeConverter)
    const navigate = useNavigate();
    const onEdit = (id: string) => {
        navigate(EDIT_EMPLOYEE_ROUTE.replace(':id', id))
    }
    if (loading) {
        return <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress />
        </Backdrop>
    }
    return <Grid spacing={2} sx={{ minHeight: '100%' }} justifyContent='space-between' container direction='column'>
        <Grid item>
            <Typography component="h2" variant="h4" align="center" gutterBottom>
                Employee List
            </Typography>
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Qualification</TableCell>
                            <TableCell>Photo</TableCell>
                            <TableCell>ID Proof</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map(employee => <TableRow key={employee.id}>
                            <TableCell>{employee.fullName}</TableCell>
                            <TableCell>{employee.recruitType}</TableCell>
                            <TableCell>{employee.qualification}</TableCell>
                            <TableCell><DownloadIcon path={employee.employeePhoto.path}></DownloadIcon></TableCell>
                            <TableCell><DownloadIcon path={employee.idProofPhoto.path}></DownloadIcon></TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(employee.id)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
}
export const EMPLOYEE_LIST_ROUTE = '/employeeList'
