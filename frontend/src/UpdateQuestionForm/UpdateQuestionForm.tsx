import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Paper, Typography, Container } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";

import { FormInputText } from "../form_components/FormInputText";
import { FormInputDropdown } from "../form_components/FormInputDropdown";
import { FormMultipleInputDropdown } from "../form_components/FormMultipleInputDropdown";
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

export default function UpdateForm() {
  const { id } = useParams<{ id: string }>();
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { control, setValue } = methods;
  const [editorContent, setEditorContent] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      fetch(`http://localhost:3000/api/questions/${id}`)
        .then((response) => response.json())
        .then((responseData) => {
          setQuestion(responseData);
          const { title, topics, difficulty, content } = responseData;
          setValue("title", title);
          setValue("topics", topics.split(',').map((topic: string) => topic.trim()).join(', '));
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

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = methods.getValues();
    const formDataWithEditorContent = {
      ...formData,
      content: editorContent,
    };

    for (const key in formDataWithEditorContent) {
      if (formDataWithEditorContent.hasOwnProperty(key)) {
        const value = formDataWithEditorContent[key as keyof IFormInput];
        if ((!value) || ((key === "content") && (value === "<p></p>\n"))) {
          setFormSubmitted(true);
          setErrorMessage(`${key} is empty`);
          return;
        }
      }
    }

    fetch(`http://localhost:3000/api/questions/${id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataWithEditorContent),
    })
      .then((response) => {
        if (response.status === 400) {
          return response.json().then((responseData) => {
            setErrorMessage(responseData.error);
            throw new Error("Title already exists");
          });
        }
        response.json();
      })
      .then(() => {
        navigate(`/questions/${id}`);
      })
      .catch((error) => {
        console.error("Error putting question", error);
      });
  };

  const handleBack = () => {
    navigate(`/questions/${id}`);
  };

  const editorHandleChange = (newContent: string) => {
    setEditorContent(newContent);
  };

  if (question === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }

  // Showcases the FE visible components
  return (
    <form onSubmit={(e) => onUpdate(e)}>
      <Container maxWidth="lg" style={{ margin: "40px auto 0 auto", backgroundColor: "#E6E6E6", borderRadius: "20px", maxWidth: "80%", padding: "20px" }}>
        <Paper style={{ display: "grid", gridRowGap: "20px", padding: "20px", borderRadius: "15px" }}>
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            Update a Question
          </Typography>
          <FormInputText name="title" control={control} label="Question Title" options={[]} formSubmitted={formSubmitted} />
          <FormMultipleInputDropdown name="topics" control={control} label="Topics" options={dropdownTopicsOptions} formSubmitted={formSubmitted} />
          <FormInputDropdown name="difficulty" control={control} label="Complexity" options={dropdownComplexityOptions} formSubmitted={formSubmitted} />
          <Container maxWidth="md">
            <h4>Description:</h4>
            <FormInputTextEditor onChange={editorHandleChange} content={question.content} formSubmitted={formSubmitted} />
          </Container>
          <div style={{ justifyContent: "space-between", margin: "0 auto" }}>
            <Button type="submit" variant="contained" style={{ fontSize: "16px", backgroundColor: "#6C63FF", borderRadius: "15px", color: "white", textTransform: "none", margin: "0 auto", marginRight: "30px" }}>
              Update
            </Button>
            <Button onClick={handleBack} variant="contained" style={{ fontSize: "16px", backgroundColor: "gray", borderRadius: "15px", color: "white", textTransform: "none", margin: "0 auto" }}>
              Back
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

