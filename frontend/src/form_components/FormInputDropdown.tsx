import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";

export const FormInputDropdown: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  options
}) => {
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
    <FormControl size={"small"} required>
      <InputLabel id="labelid" htmlFor="age-native-required">{label}</InputLabel>
      <Controller
        rules={{ required: "Required" }}
        render={({ field: { onChange, value } }) => (
          <Select 
            onChange={onChange} 
            value={value}
            inputProps={{
              id: 'age-native-required',
            }}
            labelId="labelid"
            label={label}
            >
            {generateSingleOptions()}
          </Select>
        )}
        control={control}
        name={name}
      />
    </FormControl>
  );
};
