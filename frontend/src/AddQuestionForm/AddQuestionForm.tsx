// Import MUI components
import React, { useState} from "react";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { Button , Paper, Typography, Container } from "@mui/material";

// Import customised components
import { FormInputText } from "../form_components/FormInputText";
import { FormInputDropdown } from "../form_components/FormInputDropdown";
import FormInputTextEditor from "../form_components/FormInputTextEditor";

// To instantiate form components
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
  { label: "Easy", value: "Easy", },
  { label: "Medium", value: "Medium", },
  { label: "Hard", value: "Hard", }
];
 
export default function QuestionForm () {
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { control } = methods;
  const [editorContent, setEditorContent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("in onsubmit");
  
    // Access form data using methods.getValues() if you are using react-hook-form
    const formData = methods.getValues();
  
    // Include editor content in the form data
    const formDataWithEditorContent = {
      ...formData,
      content: editorContent,
    };
    
    console.log(formDataWithEditorContent)
    for (const key in formDataWithEditorContent) {
      if (formDataWithEditorContent.hasOwnProperty(key)) {
        const value = formDataWithEditorContent[key as keyof IFormInput];
        if ((!value) || ((key === "content") && (value === "<p></p>\n"))) {
          console.error(`${key} is empty`);
          setFormSubmitted(true);
          return;
        }
      }
    }
  
    // Handle form submission logic here
    fetch('http://localhost:3000/api/questions', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(formDataWithEditorContent), // Send the modified data
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log("response", responseData);
        const id = responseData._id;
        console.log("data submitted");
        navigate(`/questions/${id}`);
      })
      .catch((error) => {
        // Handle the error (e.g., show an error message)
        console.error("Error posting question", error);
      });
  };

  const handleBack = () => {
    navigate("/questions");
  }

  // Update editor content when it changes
  const editorHandleChange = (newContent: string) => {
    setEditorContent(newContent);
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
    <Paper
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "20px",
        margin: "10px 100px",
      }}
    >
      {/* Show Title of Form */}
      <Typography variant="h6">Add a new question</Typography>

      {/* Add input components */}
      <FormInputText 
        name="title" 
        control={control} 
        label="Question Title" 
        options={[]} 
        formSubmitted={formSubmitted} 
      />

      <FormInputDropdown
        name="category"
        control={control}
        label="Category"
        options={dropdownCategoryOptions}
        formSubmitted={formSubmitted}
      />

      <FormInputDropdown
        name="difficulty"
        control={control}
        label="Complexity"
        options={dropdownComplexityOptions}
        formSubmitted={formSubmitted}
      />

      {/* Placed Container outside of text editor to keep the FormInputTextEditor flexible for other usage */}
      <Container maxWidth="lg">
      <h4>Description:</h4>
        <FormInputTextEditor
          onChange={editorHandleChange}
          content={editorContent}
          formSubmitted={formSubmitted}
        />
      </Container>

      <Button type="submit" variant={"contained"}>
        {" "}
        Submit{" "}
      </Button>

      <Button onClick={handleBack} variant={"contained"}>
        {" "}
        Back{" "}
      </Button>

      {/* <Button onClick={() => reset()} variant={"outlined"}>
        {" "}
        Reset{" "}
      </Button> */}

    </Paper>
    </form>
  );
};
