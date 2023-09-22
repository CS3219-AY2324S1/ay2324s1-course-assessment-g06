import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormInputProps } from "./FormInputProps";

export const FormInputText: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
  formSubmitted
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
          // required
          helperText={formSubmitted && value === ""? "Required" : null}
          size="small"
          error={formSubmitted && value === ""}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
        />
      )}
    />
  );
};
