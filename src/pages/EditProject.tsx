import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormField from "../components/common/FormField";
import { CREATE_MODE, EDIT_MODE, MODE, getProject, saveEnitity, updateEnitity } from "../lib/util";
import { PROJECT_COLLECTION, Project } from "../model/project.model";
import { projectSchema } from "../schema/project.schema";

type EditProjectProps = {
    onSuccessfullSave: () => any;
    mode: MODE,
    id?: string;
}

export const EditProject = ({ onSuccessfullSave, mode, id }: EditProjectProps) => {
    const methods = useForm({
        resolver: yupResolver(projectSchema),
        defaultValues: {
            name: '',
        }
    });

    useEffect(() => {
        const func = async () => {
            if (mode === EDIT_MODE) {
                const project = await getProject(id || '');
                methods.reset({
                    name: project.name,
                })
            }
        }
        func();
    }, [id, methods, mode])
    const onError = (data: any) => console.error(data);

    const onCreate = async (data: any) => {
        const project: Omit<Project, "id"> = {
            name: data.name
        }
        try {
            await saveEnitity(PROJECT_COLLECTION, project)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }
    const onUpdate = async (data: any) => {
        const project: Project = {
            name: data.name,
            id: id || ''
        }
        try {
            await updateEnitity(PROJECT_COLLECTION, project, project.id)
            onSuccessfullSave()

        } catch (error) {
            console.error(error)
        }
    }

    const onSubmit = async (data: any) => {
        mode === CREATE_MODE ? await onCreate(data) : await onUpdate(data)
    }

    return <FormProvider {...methods}>
        <Box component='form' onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <DialogTitle>New Project</DialogTitle>
            <DialogContent>
                <Grid spacing={2} mt={1} container>
                    <Grid item xs={12}>
                        <FormField required fullWidth variant='outlined' label='Name' name='name'></FormField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions><Button type='submit'>Submit</Button></DialogActions>
        </Box>
    </FormProvider>
}