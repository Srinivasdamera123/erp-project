import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    name: string;
    label: string;
} & CheckboxProps;

const FormCheckBox: FC<Props> = ({ name, label, ...otherProps }) => {
    const {
        control,
    } = useFormContext();

    return (
        <Controller control={control} name={name} render={({ field }) => (
            <FormControlLabel control={<Checkbox {...otherProps}  {...field} />} label={label} />
        )}
        />
    );
};

export default FormCheckBox;