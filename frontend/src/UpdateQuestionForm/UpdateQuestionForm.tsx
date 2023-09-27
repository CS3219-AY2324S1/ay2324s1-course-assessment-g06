// Import MUI components
import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button , Paper, Typography, Container } from "@mui/material";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

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
  const { control, setValue } = methods;
  const [editorContent, setEditorContent] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Called at the start to retrieve existing data
  useEffect(() => {
    const fetchData = () => {
      console.log("Fetching data for id:", id);
      fetch(`http://localhost:3000/api/questions/${id}`)
        .then((response) => response.json())
        .then((responseData) => {
          setQuestion((prevQuestion) => ({
            ...prevQuestion,
            ...responseData,
          }));
          // Update default form values based on fetched data
          const { title, category, difficulty, content } = responseData;
          setValue("title", title);
          setValue("category", category);
          setValue("difficulty", difficulty);
          setEditorContent(content);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setQuestion(null);
        });
    };

    fetchData();
  }, [id, setValue]);

  // Called when clicking on update button to submit new data
  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          setErrorMessage(`${key} is empty`);
          return;
        }
      }
    }

    fetch(`http://localhost:3000/api/questions/${id}`, {  
      method: 'PUT', 
      mode: 'cors',
      headers: {
      "Content-Type": "application/json", 
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
      response.json();
    })
    .then((responseData) => {
      navigate(`/questions/${id}`);
      // Navigate to a different page or reset the form here
    })
    .catch((error) => {
      console.error("Error putting question", error);
    });
  };

  const handleBack = () => {
    navigate(`/questions/${id}`);
  }

  // Update editor content when it changes
  const editorHandleChange = (newContent: string) => {
    setEditorContent(newContent);
  };

  if (question === null) {
    return <div>Loading...</div>;
  }

  // Showcases the FE visible components
  return (
    <form onSubmit={(e) => onUpdate(e)}>
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
      <FormInputText name="title" control={control} label="Question Title" options={[]} formSubmitted={formSubmitted}/>

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
      <Container maxWidth="md">
      <h4>Description:</h4>
        <FormInputTextEditor
          onChange={editorHandleChange}
          content={question.content}
          formSubmitted={formSubmitted}
        />
      </Container>

      <Button type="submit" variant={"contained"}>
        {" "}
        Update{" "}
      </Button>

      <Button onClick={handleBack} variant={"contained"}>
        {" "}
        Back{" "}
      </Button>

      {errorMessage && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}

    </Paper>
    </form>
  );
};
