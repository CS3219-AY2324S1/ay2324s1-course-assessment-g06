// Import MUI components
import React, { useState} from "react";
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { Button , Paper, Typography, Container } from "@mui/material";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// Import customised components
import { FormInputText } from "../form_components/FormInputText";
import { FormInputDropdown } from "../form_components/FormInputDropdown";
import { FormMultipleInputDropdown } from "../form_components/FormMultipleInputDropdown";
import FormInputTextEditor from "../form_components/FormInputTextEditor";

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
  { label: "Backtracking", value: "Backtracking" },
  { label: "Binary Search", value: "Binary Search" },
  { label: "Binary Search Tree", value: "Binary Search Tree" },
  { label: "Bit Manipulation", value: "Bit Manipulation" },
  { label: "Breadth-First Search", value: "Breadth-First Search" },
  { label: "Combinatorics", value: "Combinatorics" },
  { label: "Data Structures", value: "Data Structures" },
  { label: "Depth-First Search", value: "Depth-First Search" },
  { label: "Design", value: "Design" },
  { label: "Divide and Conquer", value: "Divide and Conquer" },
  { label: "Dynamic Programming", value: "Dynamic Programming" },
  { label: "Geometry", value: "Geometry" },
  { label: "Greedy", value: "Greedy" },
  { label: "Hash Table", value: "Hash Table" },
  { label: "Linked List", value: "Linked List" },
  { label: "Math", value: "Math" },
  { label: "Matrix", value: "Matrix" },
  { label: "Memoization", value: "Memoization" },
  { label: "Merge Sort", value: "Merge Sort" },
  { label: "Monotonic", value: "Monotonic" },
  { label: "Stack", value: "Stack" },
  { label: "Recursion", value: "Recursion" },
  { label: "Rolling Hash", value: "Rolling Hash" },
  { label: "Simulation", value: "Simulation" },
  { label: "Sliding Window", value: "Sliding Window" },
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
          setErrorMessage(`${key} is empty`);
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
      <Container
        maxWidth="lg"
        style={{
          margin: "40px auto 0 auto",
          backgroundColor: "#E6E6E6",
          borderRadius: "20px",
          maxWidth: "80%",
          padding: "20px",
        }}
      >
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
            Add New Question
          </Typography>

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

          {errorMessage && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}
        </Paper>
      </Container>
    </form>
  );
}