// Import MUI components
import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { TextField, FormControl, Button , Paper, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import customised components
import { FormInputText } from "../form_components/FormInputText";
import { FormInputDropdown } from "../form_components/FormInputDropdown";
import FormInputTextEditor from "../form_components/FormInputTextEditor";

interface Question {
  _id: string;
  title: string;
  frontendQuestionId: string;
  difficulty: string;
  content: string;
  category: string;
  topics: string;
}

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

const dropdownCategoryOptions = [
  { label: "Data Structures", value: "Data Structures", },
  { label: "Algorithms", value: "Algorithms", },
];

const dropdownComplexityOptions = [
  {label: "Easy", value: "Easy", },
  { label: "Medium", value: "Medium", },
  { label: "Hard", value: "Hard", }
];

export default function UpdateForm () {
  // Initialise form attributes
  const { id } = useParams<{ id: string }>();
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch} = methods;
  const [editorContent, setEditorContent] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);

  const fetchData = () => {
    console.log("Fetching data for id:", id);
    fetch(
      `http://localhost:3000/api/questions/${id}`
    )
      .then((response) => response.json())
      .then((responseData) => {
        setQuestion(responseData);
        // Update default form values based on fetched data
        const updatedDefaultValues = {
          title: responseData.title,
          category: responseData.category,
          difficulty: responseData.difficulty,
          content: responseData.content,
        };
        methods.reset(updatedDefaultValues);
      })
      
      .catch((error) => {
        console.error("Error fetching data:", error);
        setQuestion(null);
      });
    };

    useEffect(() => {
      fetchData();
    }, [id]);

  // Called when clicking on update button
  const onUpdate = (data: IFormInput) => {
    console.log("Putting contents of ", id);
    // Include editor content in the form data
    const formDataWithEditorContent = {
      ...data,
      content: editorContent,
    };
    console.log(formDataWithEditorContent);
    fetch(`http://localhost:3000/api/questions/${id}`, {  
      method: 'PUT', 
      mode: 'cors',
      headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(formDataWithEditorContent), // Send the modified data
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Question put successfully", responseData);
      // Navigate to a different page or reset the form here
    })
    .catch((error) => {
      console.error("Error putting question", error);
    });
  };

  // Update editor content when it changes
  const editorHandleChange = (newContent: string) => {
    setEditorContent(newContent);
  };

  if (question === null) {
    return <div>Loading...</div>;
  }

  // Showcases the FE visible components
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
      <Typography variant="h6">Update a question</Typography>

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
          content={question.content}
        />
      </Container>

      <Button onClick={handleSubmit(onUpdate)} variant={"contained"}>
        {" "}
        Update{" "}
      </Button>

    </Paper>
  );
};