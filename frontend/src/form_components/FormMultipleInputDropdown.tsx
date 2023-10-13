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
  // Initialize the state as an empty array
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (values: string[]) => {
    setSelected(values);
  };

  const generateSingleOptions = () => {
    return options.map((option: any) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };

  return (
    <FormControl error={formSubmitted && selected.length === 0}>
      <InputLabel id="labelid">{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            multiple
            onChange={(e) => {
              handleChange(e.target.value);
              onChange(e.target.value);
            }}
            value={value || []} // Ensure value is always an array
            labelId="labelid"
            label={label}
            error={!!error}
          >
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
        rules={{ required: true }}
      />
      {formSubmitted && selected.length === 0 && (
        <FormHelperText>Required</FormHelperText>
      )}
    </FormControl>
  );
};
