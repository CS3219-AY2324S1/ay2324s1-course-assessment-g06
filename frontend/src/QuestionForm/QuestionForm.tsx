// Import MUI components
import React, {useState} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TextField, FormControl, Button , Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom"

// Import customised components
import { FormInputText } from "./questionform_components/FormInputText";
import { FormInputDropdown } from "./questionform_components/FormInputDropdown";
// import { FormRichTextEditor } from "./questionform_components/FormRichTextEditor";

interface IFormInput {
  questionTitle: string;
  categoryDropdownValue: string;
  complexityDropdownValue: string;
  questionDescription: string;
}

const defaultValues = {
  questionTitle: "",
  categoryDropdownValue: "",
  complexityDropdownValue: "",
  questionDescription: "",
};

const dropdownCategoryOptions = [
  {
    label: "Data Structures",
    value: "1",
  },
  {
    label: "Algorithms",
    value: "2",
  },
];

const dropdownComplexityOptions = [
  {
    label: "Easy",
    value: "1",
  },
  {
    label: "Medium",
    value: "2",
  },
  {
    label: "Hard",
    value: "3",
  }
];
 
export default function QuestionForm () {
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch } = methods;
  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <Paper
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "20px",
        margin: "10px 200px",
      }}
    >
      {/* Show Title of Form */}
      <Typography variant="h6">Add a new question</Typography>

      {/* Add input components */}
      <FormInputText name="questionTitleValue" control={control} label="Question Title" options={[]} />

      <FormInputDropdown
        name="categoryDropdownValue"
        control={control}
        label="Category"
        options={dropdownCategoryOptions}
      />

      <FormInputDropdown
        name="complexityDropdownValue"
        control={control}
        label="Complexity"
        options={dropdownComplexityOptions}
      />

      <FormInputText name="description" control={control} label="Description" options={[]} />

      {/* Submit question button */}
      <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
        {" "}
        Submit{" "}
      </Button>

      {/* Reset button, can remove if dont want */}
      <Button onClick={() => reset()} variant={"outlined"}>
        {" "}
        Reset{" "}
      </Button>

    </Paper>
  );
};
