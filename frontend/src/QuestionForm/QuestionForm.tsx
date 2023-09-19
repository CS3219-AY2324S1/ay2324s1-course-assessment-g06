// Import MUI components
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form";
import { TextField, FormControl, Button , Paper, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import customised components
import { FormInputText } from "./questionform_components/FormInputText";
import { FormInputDropdown } from "./questionform_components/FormInputDropdown";
import FormInputTextEditor from "./questionform_components/FormInputTextEditor";

interface IFormInput {
  title: string;
  category: string;
  difficulty: string;
  content: string;
}

const defaultValues = {
  title: "",
  category: "",
  difficulty: "",
  content: "",
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
  const [editorContent, setEditorContent] = useState("");


  const onSubmit = (data: IFormInput) => {
    // Include editor content in the form data
    const formDataWithEditorContent = {
      ...data,
      content: editorContent,
    };
    console.log(formDataWithEditorContent);

    fetch('http://localhost:3000/api/questions', {  
      method: 'POST', 
      mode: 'cors', 
      headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify(formDataWithEditorContent), // Send the modified data
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Question posted successfully", responseData);

      // You can also navigate to a different page or reset the form here
    })
    .catch((error) => {
      // Handle the error (e.g., show an error message)
      console.error("Error posting question", error);
    });
};

  // Update editor content when it changes
  const editorHandleChange = (newContent: string) => {
    setEditorContent(newContent);
  };

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
      <FormInputText name="title" control={control} label="Question Title" options={[]} />

      <FormInputDropdown
        name="category"
        control={control}
        label="Category"
        options={dropdownCategoryOptions}
      />

      <FormInputDropdown
        name="difficulty"
        control={control}
        label="Complexity"
        options={dropdownComplexityOptions}
      />

      {/* Placed Container outside of text editor to keep the FormInputTextEditor flexible for other usage */}
      <Container maxWidth="md">
      <h4>Description:</h4>
        <FormInputTextEditor
          onChange={editorHandleChange}
          content={editorContent}
        />
      </Container>

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
