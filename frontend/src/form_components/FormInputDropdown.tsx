import React, { useState } from "react";
import {FormControl, InputLabel, MenuItem, Select, FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";

export const FormInputDropdown: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options,
  formSubmitted, // Receive the prop
}) => {
  // Define state variables using the useState hook
  const [selected, setSelected] = useState<null | string>(null); // Initialize with null or string type

  const handleChange = (value: string) => {
    setSelected(value);
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
    <FormControl error={(formSubmitted && selected === null)}>
      <InputLabel id="labelid">{label}</InputLabel>
      <Controller
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Select
            onChange={(e) => {
              handleChange(e.target.value);
              onChange(e.target.value);
            }}
            value={value}
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
      { formSubmitted && selected == null && (
        <FormHelperText>Required</FormHelperText>
      )}
    </FormControl>
  );
};
