import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Fab, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, debounce } from "@mui/material";
import moment from 'moment';
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import FormDateField from '../components/common/FormDateField';
import FormField from "../components/common/FormField";
import { projectConverter } from '../converters/project.converter';
import { useCollection } from '../hooks/collection.hook';
import { CREATE_MODE, EDIT_MODE, MODE, getContractor, saveEnitity, updateEnitity } from '../lib/util';
import { CONTRACTOR_COLLECTION, Contractor } from '../model/contractor.model';
import { PROJECT_COLLECTION, Project } from '../model/project.model';
import { contractorSchema } from '../schema/contractor.schema';


type EditContractorProps = {
    onSuccessfullSave: () => any;
    mode: MODE,
    id?: string;
}

export const EditContractor = ({ onSuccessfullSave, mode, id }: EditContractorProps) => {
    const [projects] = useCollection<Project>(PROJECT_COLLECTION, projectConverter)

    const methods = useForm({
        resolver: yupResolver(contractorSchema),
        defaultValues: defaultValue,
    });
    const { fields, append, remove } = useFieldArray({
        name: 'transactions',
        control: methods.control,
    });

    useEffect(() => {
        const func = async () => {
            if (mode === EDIT_MODE) {
                const contractor = await getContractor(id || '');
                methods.reset({
                    name: contractor.name,
                    totalAmount: contractor.totalAmount,
                    remainingAmount: contractor.remainingAmount,
                    project: contractor.project.id,
                    transactions: contractor.transactions.map(transaction => ({
                        description: transaction.description,
                        amount: transaction.amount,
                        date: moment(transaction.date.toDate())
                    }))
                })
            }
        }
        func();
    }, [id, methods, mode])

    const onSubmit = async (data: any) => {
        mode === CREATE_MODE ? onCreate(data) : onEdit(data)
    }

    const onAmountChange = () => {
        const sum = methods.getValues('transactions').reduce((sum, { amount }) => sum + (+amount), 0)
        methods.setValue('remainingAmount', +methods.getValues('totalAmount') - sum)
    }


    const onCreate = async (data: any) => {
        const contractor: Omit<Contractor, "id"> = {
            name: data.name,
            totalAmount: data.totalAmount,
            remainingAmount: data.remainingAmount,
            project: data.project,
            transactions: [...data.transactions]
        }

        try {
            await saveEnitity<Contractor>(CONTRACTOR_COLLECTION, contractor)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }

    const onEdit = async (data: any) => {
        const contractor: Contractor = {
            name: data.name,
            totalAmount: data.totalAmount,
            remainingAmount: data.remainingAmount,
            project: data.project,
            transactions: [...data.transactions],
            id: id || ''
        }

        try {
            await updateEnitity<Contractor>(CONTRACTOR_COLLECTION, contractor, contractor.id)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }

    const onError = (data: any) => console.error(data);

    return <FormProvider {...methods}>
        <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <DialogTitle>
                Edit Contractor
            </DialogTitle>
            <DialogContent>
                <Grid spacing={2} mt={1} container>
                    <Grid item xs={6}>
                        <FormField required fullWidth variant='outlined' label='Name' name='name'></FormField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormField select required fullWidth variant='outlined' label='Project' name='project'>
                            {projects?.map(project => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
                        </FormField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormField required fullWidth type='number' variant='outlined' label='Total Amount' onFieldChange={debounce(onAmountChange, 1000)} name='totalAmount'></FormField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormField disabled required fullWidth type='number' variant='outlined' label='Remaining Amount' name='remainingAmount'></FormField>
                    </Grid>
                    <Grid width='100%' xs={12} item>
                        <Typography component="h4" variant="h6" align="center" gutterBottom>Transactions</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <FormField size='small' required fullWidth variant='outlined' label='Description' name={`transactions.${index}.description`}></FormField>
                                            </TableCell>
                                            <TableCell>
                                                <FormField required size='small' onFieldChange={debounce(onAmountChange, 1000)} fullWidth type='number' variant='outlined' label='Amount' name={`transactions.${index}.amount`}></FormField>
                                            </TableCell>
                                            <TableCell>
                                                <FormDateField size='small' required fullWidth variant='outlined' label='Date' name={`transactions.${index}.date`}></FormDateField>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => remove(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell>
                                            <Fab sx={{ m: 1 }} onClick={() => append({
                                                description: '',
                                                amount: 0,
                                                date: moment()
                                            })} size="small" color="secondary" aria-label="add">
                                                <AddIcon />
                                            </Fab>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button type='submit'>
                    Submit
                </Button>
            </DialogActions>
        </Box>
    </FormProvider>
}


const defaultValue = {
    name: '',
    totalAmount: 0,
    remainingAmount: 0,
    project: '',
    transactions: [{
        description: '',
        amount: 0,
        date: moment()
    }]
}