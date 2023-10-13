import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";

export const FormMultipleInputDropdown: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
  formSubmitted, // Receive the prop
}) => {

  return (
    <FormControl error={formSubmitted && !control._formValues[name]}>
      <InputLabel id="labelid">{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            multiple  // Allow multiple selections
            onChange={(event) => {
              // Convert selected values to a comma-separated string
              onChange(event.target.value.join(', '));
            }}
            value={(value && value.split(', ')) || []} // Convert string to an array
            labelId="labelid"
            label={label}
            error={!!error}
          >
            {options.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
        control={control}
        name={name}
        rules={{ required: true }}
      />
      {formSubmitted && !control._formValues[name] && (
        <FormHelperText>Required</FormHelperText>
      )}
    </FormControl>
  );
};