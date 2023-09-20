import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormInputProps } from "./FormInputProps";

export const FormInputText: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: "Required" }}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <TextField
          required
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          defaultValue=""
          fullWidth
          label={label}
          variant="outlined"
        />
      )}
    />
  );
};
