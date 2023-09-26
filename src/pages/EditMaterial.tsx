import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Fab, FormHelperText, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import FormCheckBox from '../components/common/FormCheckBox';
import FormField from "../components/common/FormField";
import { CREATE_MODE, EDIT_MODE, MODE, getMaterial, saveEnitity, updateEnitity } from '../lib/util';
import { MATERIAL_COLLECTION, Material } from '../model/material.model';
import { UOMS } from '../model/uom.model';
import { materialSchema } from "../schema/material.schema";


type EditMaterialProps = {
    onSuccessfullSave: () => any;
    mode: MODE,
    id?: string;
}

export const EditMaterial = ({ onSuccessfullSave, mode, id }: EditMaterialProps) => {
    const methods = useForm({
        resolver: yupResolver(materialSchema),
        defaultValues: defaultValue,
    });
    const { fields, append, remove } = useFieldArray({
        name: 'types',
        control: methods.control,
    });

    useEffect(() => {
        const func = async () => {
            if (mode === EDIT_MODE) {
                const material = await getMaterial(id || '');
                methods.reset({
                    name: material.name,
                    hasMultipleTypes: material.hasMultipleTypes,
                    price: material.price,
                    uom: material.uom,
                    types: material.types ? [...material.types] : []
                })
            }
        }
        func();
    }, [id, methods, mode])

    const watchTypes = methods.watch("hasMultipleTypes");

    const onSubmit = async (data: any) => {
        mode === CREATE_MODE ? onCreate(data) : onEdit(data)
    }

    const onCreate = async (data: any) => {
        const material: Omit<Material, "id"> = {
            name: data.name,
            uom: data.uom,
            price: data.price,
            hasMultipleTypes: data.hasMultipleTypes,
            types: data.hasMultipleTypes ? data.types : []
        }

        try {
            await saveEnitity<Material>(MATERIAL_COLLECTION, material)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }

    const onEdit = async (data: any) => {
        const material: Material = {
            name: data.name,
            uom: data.uom,
            price: data.price,
            hasMultipleTypes: data.hasMultipleTypes,
            types: data.hasMultipleTypes ? data.types : [],
            id: id || ''
        }

        try {
            await updateEnitity<Material>(MATERIAL_COLLECTION, material, material.id)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }

    const onError = (data: any) => console.error(data);

    return <FormProvider {...methods}>
        <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <DialogTitle>
                New Material
            </DialogTitle>
            <DialogContent>
                <Grid spacing={2} mt={1} container>
                    <Grid item xs={6}>
                        <FormField required fullWidth variant='outlined' label='Name' name='name'></FormField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormField select required fullWidth variant='outlined' label='UOM' name='uom'>
                            {UOMS.map(uom => <MenuItem key={uom} value={uom}>{uom}</MenuItem>)}
                        </FormField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormCheckBox label='Has multiple types?' name='hasMultipleTypes'></FormCheckBox>
                    </Grid>
                    {(!watchTypes &&
                        <Grid item xs={6}>
                            <FormField required fullWidth type='number' variant='outlined' label='Price' name='price'></FormField>
                        </Grid>)}

                    {watchTypes && <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell >Price</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <FormField size='small' fullWidth variant='outlined' label='Name' name={`types.${index}.name`}></FormField>
                                            </TableCell>
                                            <TableCell>
                                                <FormField size='small' fullWidth type='number' variant='outlined' label='Price' name={`types.${index}.price`}></FormField>
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
                                                name: '',
                                                price: 0,
                                            })} size="small" color="secondary" aria-label="add">
                                                <AddIcon />
                                            </Fab>
                                            {methods.formState.errors?.types?.type === 'min' && <FormHelperText sx={{ ml: 3 }} error >{methods.formState.errors?.types.message}</FormHelperText>}
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Grid>}

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
    hasMultipleTypes: false,
    price: 0,
    uom: '',
    types: [{ name: '', price: 0 }]
}