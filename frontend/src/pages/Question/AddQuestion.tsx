// Import MUI components
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { Button, Paper, Typography, Container } from "@mui/material";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// Import customised components
import { FormInputText } from "../../components/Matching/FormInputText";
import { FormInputDropdown } from "../../components/Matching/FormInputDropdown";
import { FormMultipleInputDropdown } from "../../components/Matching/FormMultipleInputDropdown";
import FormInputTextEditor from "../../components/Matching/FormInputTextEditor";

// Import current user for authentication
import { getCurrentUser } from "../../utils/auth.service";

// To instantiate form components
interface IFormInput {
  title: string;
  topics: string;
  difficulty: string;
  content: string;
}

const defaultValues = {
  title: "",
  topics: "",
  difficulty: "",
  content: "",
};

const dropdownTopicsOptions = [
  { label: "Array", value: "Array" },
  { label: "Binary Search", value: "Binary Search" },
  { label: "Binary Search Tree", value: "Binary Search Tree" },
  { label: "Bit Manipulation", value: "Bit Manipulation" },
  { label: "Depth-First Search", value: "Depth-First Search" },
  { label: "Design", value: "Design" },
  { label: "Greedy", value: "Greedy" },
  { label: "Hash Table", value: "Hash Table" },
  { label: "Math", value: "Math" },
  { label: "Matrix", value: "Matrix" },
  { label: "Stack", value: "Stack" },
  { label: "Simulation", value: "Simulation" },
  { label: "Sorting", value: "Sorting" },
  { label: "String", value: "String" },
  { label: "Tree", value: "Tree" },
  { label: "Trie", value: "Trie" },
  { label: "Two Pointers", value: "Two Pointers" }
];

const dropdownComplexityOptions = [
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

export default function QuestionForm() {
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { control } = methods;
  const [editorContent, setEditorContent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const QUESTION_HOST = process.env.REACT_APP_QNS_SVC || 'http://localhost:3000/api/questions';
  const currentUser = getCurrentUser();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Access form data using methods.getValues() if you are using react-hook-form
    const formData = methods.getValues();

    // Include editor content in the form data
    const formDataWithEditorContent = {
      ...formData,
      content: editorContent,
    };

    console.log(formDataWithEditorContent);
    for (const key in formDataWithEditorContent) {
      if (formDataWithEditorContent.hasOwnProperty(key)) {
        const value = formDataWithEditorContent[key as keyof IFormInput];
        if ((!value) || ((key === "content") && (value === "<p></p>\n"))) {
          console.error(`${key} is empty`);
          setFormSubmitted(true);
          setErrorMessage(`Required fields cannot be empty`);
          return;
        }
      }
    }

    // Handle form submission logic here
    fetch(QUESTION_HOST, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
        "x-access-token": currentUser.accessToken, // Send the JWT along with the request in the header
      },
      body: JSON.stringify(formDataWithEditorContent), // Send the modified data
    })
      .then((response) => {
        if (response.status === 400) {
          // Title already exists, show an alert
          return response.json().then((responseData) => {
            setErrorMessage(responseData.error);
            throw new Error("Title already exists");
          });
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("response", responseData);
        const id = responseData._id;
        navigate(`/questions/${id}`);
      })
      .catch((error) => {
        // Handle the error (e.g., show an error message)
        console.error("Error posting question", error);
      });
  };

  const handleBack = () => {
    navigate("/questions");
  };

  // Update editor content when it changes
  const editorHandleChange = (newContent: string) => {
    setEditorContent(newContent);
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div
        className='mb-3'
        style={{
          margin: '10px',
          backgroundColor: '#E6E6E6',
          borderRadius: '20px',
          padding: '20px',
        }}>
        <Paper
          style={{
            display: "grid",
            gridRowGap: "20px",
            padding: "20px",
            borderRadius: "15px",
          }}
        >
          {/* Show Title of Form */}
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Add Question
          </Typography>

          {errorMessage && (
            <Alert severity="error">
              <AlertTitle>Error!</AlertTitle>
              {errorMessage}
            </Alert>
          )}

          {/* Add input components */}
          <FormInputText
            name="title"
            control={control}
            label="Question Title"
            options={[]}
            formSubmitted={formSubmitted}
          />

          <FormMultipleInputDropdown
            name="topics"
            control={control}
            label="Topics"
            options={dropdownTopicsOptions}
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
          <FormInputTextEditor
            onChange={editorHandleChange}
            content={editorContent}
            formSubmitted={formSubmitted}
          />

          <div
            style={{
              justifyContent: "space-between",
              margin: "0 auto",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              style={{
                fontSize: "16px",
                backgroundColor: "#6C63FF",
                borderRadius: "15px",
                color: "white",
                textTransform: "none",
                margin: "0 auto",
                marginRight: "30px",
              }}
            >
              Add
            </Button>
            <Button
              onClick={handleBack}
              variant="contained"
              style={{
                fontSize: "16px",
                backgroundColor: "gray",
                borderRadius: "15px",
                color: "white",
                textTransform: "none",
                margin: "0 auto",
              }}
            >
              Cancel
            </Button>
          </div>
        </Paper>
      </div>
    </form>
  );
}
