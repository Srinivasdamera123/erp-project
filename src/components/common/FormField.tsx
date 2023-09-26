import { TextField, TextFieldProps } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    onFieldChange?: () => any
    name: string;
} & TextFieldProps;

const FormField: FC<Props> = ({ name, onFieldChange, ...otherProps }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const [error, setError] = useState<any>();

    useEffect(() => {
        var error: any;
        if (name.indexOf('.') !== -1) {
            const keys = name.split('.');
            error = errors;
            for (var key of keys) {

                if (!error) break;

                var validatedKey: string | number = key;
                if (!Number.isNaN(parseInt(key))) {
                    validatedKey = + key;
                }
                error = error[validatedKey]
            }
        } else {
            error = errors[name];
        }
        setError(error)
    }, [errors])


    return (
        <Controller control={control} name={name} render={({ field }) => (
            <TextField {...otherProps} {...field} onChange={e => {
                field.onChange(e)
                onFieldChange && onFieldChange();
            }} error={!!error} helperText={error?.message?.toString()} >
                {otherProps.children}
            </TextField>
        )
        }
        />
    );
};

export default FormField;