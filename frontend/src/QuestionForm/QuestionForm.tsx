// Import MUI components
import React, {useState} from "react";
import { Link } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form";
import { TextField, FormControl, Button , Paper, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import customised components
import { FormInputText } from "./questionform_components/FormInputText";
import { FormInputDropdown } from "./questionform_components/FormInputDropdown";
import FormInputTextEditor from "./questionform_components/FormInputTextEditor";

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

// Editor should have some fixed input
const editorContent = "";

const editorHandleChange = (newContent: string) => {
  // Update the state or perform any other actions with the new content
};

const editorStyle = {
  editorWrapper: {
    marginTop: '1rem',
  },
  editor: {
    border: '1px solid #f1f1f1',
    height: '500px',
    padding: '1rem',
    overflow: 'scroll',
  },
  editorLinkPopup: {
    height: 'auto',
  },
  editorImagePopup: {
    left: '-100%',
  },
};

const dropdownCategoryOptions = [
  {
    label: "Data Structures",
    value: "Data Structures",
  },
  {
    label: "Algorithms",
    value: "Algorithms",
  },
];

const dropdownComplexityOptions = [
  {
    label: "Easy",
    value: "Easy",
  },
  {
    label: "Medium",
    value: "Medium",
  },
  {
    label: "Hard",
    value: "Hard",
  }
];
 
export default function QuestionForm () {
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch} = methods;
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

      <h4>Description:</h4>
      <FormInputTextEditor
        onChange={editorHandleChange}
        content={editorContent}
      />

      <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
        {" "}
        Submit{" "}
      </Button>

      <Button onClick={() => reset()} variant={"outlined"}>
        {" "}
        Reset{" "}
      </Button>

    </Paper>
  );
};
