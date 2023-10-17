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

interface FormInputPropsWithDefault extends FormInputProps {
  defaultValue?: string | null; // Add defaultValue as an optional prop
}

export const FormMultipleInputDropdown: React.FC<FormInputPropsWithDefault> = ({
  name,
  control,
  label,
  options,
  formSubmitted, // Receive the prop
  defaultValue, // Optional default value

}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    (defaultValue?.split(',').map((item) => item.trim()) || [])
  );
  
  return (
    <FormControl error={formSubmitted && !control._formValues[name]}>
      <InputLabel id="labelid">{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <Select
              multiple  // Allow multiple selections
              onChange={(event) => {
                const newSelectedValues = event.target.value as string[]; // Ensure it's an array of strings
                setSelectedValues(newSelectedValues); // Update selectedValues
                // Convert selected values to a comma-separated string
                onChange(newSelectedValues.join(', '));
              }}
              value={selectedValues} // Use the selectedValues array
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
          );
        }}
        control={control}
        name={name}
        rules={{ required: true }}
      />
      {formSubmitted && selectedValues.length === 0 && (
        <FormHelperText>At least one option must be selected.</FormHelperText>
      )}
    </FormControl>
  );
};
