import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Question.css";
import { styled } from "@mui/material/styles";
import { Button, Container, Grid, Paper } from "@mui/material";

const DeleteButton = styled(Button)`
  background-color: #ff5733; /* Change the background color */
  color: black; /* Change the text color */
  border-radius: 5px; /* Add rounded corners */
  font-size: 16px; /* Adjust the font size */
  font-weight: bold;
  &:hover {
    background-color: #fe6848; /* Change the background color on hover */
  }
`;

interface QuestionInt {
  _id: string;
  title: string;
  frontendQuestionId: string;
  difficulty: string;
  content: string;
  category: string;
  topics: string;
}

const QuestionWrapper = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgb(231, 231, 231)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  fontWeight: 'bold',
  textAlign: 'center',
  borderRadius: '50px',
}));

const CategoryWrapper = styled(Container)(({ theme }) => ({
  backgroundColor: 'rgb(255, 192, 203)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  fontWeight: 'bold',
  textAlign: 'center',
  borderRadius: '50px',
}));

export default function Question() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const [question, setQuestion] = useState<QuestionInt | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataWithDelay = () => {
      console.log("Fetching data for id:", id);
  
      // Add a delay of, for example, 1000 milliseconds (1 second)
      const delay = 200;
  
      setTimeout(() => {
        fetch(`http://localhost:3000/api/questions/${id}`)
          .then((response) => response.json())
          .then((responseData) => {
            setQuestion(responseData);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setQuestion(null);
          });
      }, delay);
    };
  
    fetchDataWithDelay(); // Call the function immediately
  
  }, [id]);


  function wrapPreTags(content : string) {
    // Use regular expressions to add a class to <pre> tags
    const wrappedContent = content.replace(/<pre>/g, '<pre class="pre-wrap">');
    return wrappedContent;
  }

  const handleDelete = () => {
    // Send a DELETE request to delete the question
    fetch(`http://localhost:3000/api/questions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Question deleted successfully");
          navigate("/questions");
        } else {
          console.error("Error deleting question:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const handleUpdate = () => {
    navigate(`/questions/${id}/update`);
  }

  const handleBack = () => {
    navigate("/questions");
  }

  if (question === null) {
    return <div>Loading...</div>;
  }

  // Check if question is defined before accessing its properties
  if (question !== undefined) {
    return (
      <Container maxWidth="lg" style={{ margin: "0 auto" }}> 
      {/* <div className="box"> */}

      <Grid item xs={12}>
          <Button variant="contained" onClick={handleBack}>
            Back </Button>
        </Grid>
        
        <Grid sx={{ flexGrow: 1 }} container spacing={1}>

          <Grid item xs={12}>
              <h1>{question.title}</h1>
          </Grid>

          <Grid item xs={6}>
            <QuestionWrapper>{question.category}</QuestionWrapper>
          </Grid>

          <Grid item xs={6}>
            <CategoryWrapper>{question.difficulty}</CategoryWrapper>
          </Grid>

          <Container maxWidth="lg">
            <Paper
            style={{
              padding: "20px",
              margin: "10px",
            }}>
            <Grid item xs={12}>
              <div className="content-wrapper">
                <div dangerouslySetInnerHTML={{ __html: wrapPreTags(question.content) }} />
              </div>
            </Grid>
            </Paper>
          </Container>

          <Grid item xs={6}>
              <DeleteButton variant="contained" onClick={handleDelete}>
                Delete
              </DeleteButton>
          </Grid>
          <Grid item xs={6}>
              <Button variant="contained" onClick={handleUpdate}>
                Update
              </Button>
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    return <div>Question not found.</div>;
  }
}
