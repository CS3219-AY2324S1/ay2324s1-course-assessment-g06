import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Question.css";
import { styled } from "@mui/material/styles";
import { Button, Container, Grid, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DeleteButton = styled(Button)`
  background-color: #ff5733;
  color: black;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  &:hover {
    background-color: #fe6848;
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
  backgroundColor: "#d8d8d8",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  fontWeight: "bold",
  textAlign: "center",
  borderRadius: "50px",
}));

const CategoryWrapper = styled(Container)(({ theme }) => ({
  backgroundColor: "rgb(255, 192, 203)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  fontWeight: "bold",
  textAlign: "center",
  borderRadius: "50px",
}));

export default function Question() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<QuestionInt | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataWithDelay = () => {
      fetch(`http://localhost:3000/api/questions/${id}`)
        .then((response) => response.json())
        .then((responseData) => {
          setQuestion(responseData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setQuestion(null);
        });
    };

    fetchDataWithDelay();
  }, [id]);

  function wrapPreTags(content: string) {
    const wrappedContent = content.replace(/<pre>/g, '<pre class="pre-wrap">');
    return wrappedContent;
  }

  const handleBack = () => {
    navigate("/questions");
  };

  const handleDelete = () => {
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
  };

  if (question === null) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      maxWidth="lg"
      style={{
        margin: "40px auto 0 auto",
        backgroundColor: "#E6E6E6",
        borderRadius: "20px",
        width: "80%",
        padding: "20px",
      }}
    >

      {/* <Grid item xs={12}>
        <Button
          variant="contained"
          style={{
            left: "-100px",
            fontSize: "25px",
            borderRadius: "80px",
            backgroundColor: "#D9D9D9",
          }}
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </Button>
      </Grid> */}


      <Paper
        style={{
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Grid sx={{ flexGrow: 1 }} container spacing={1}>
          <Grid item xs={12} container justifyContent="space-between">
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
                {question.title}
              </h1>
            </div>
            <div>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#6C63FF",
                  borderRadius: "50px",
                  fontSize: "15px",
                  marginRight: "10px",
                }}
                onClick={handleUpdate}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#FF6A6A",
                  borderRadius: "20px",
                }}
                onClick={handleDelete}
              >
                <DeleteIcon />
              </Button>
            </div>
          </Grid>

          <Grid item xs={1.5}>
            <CategoryWrapper>{question.difficulty}</CategoryWrapper>
          </Grid>

          {question.topics.split(', ').map((topic, index) => (
            <Grid item xs={topic.length < 10 ? 1.5 : topic.length < 15 ? 2 : 3} key={index}>
              <QuestionWrapper>{topic}</QuestionWrapper>
            </Grid>
          ))}

          <Container maxWidth="lg" style={{ marginTop: "30px" }}>
            <Grid item xs={12}>
              <div
                className="content-wrapper"
                style={{ overflow: "auto", maxHeight: "400px" }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: wrapPreTags(question.content),
                  }}
                />
              </div>
            </Grid>
          </Container>
        </Grid>
      </Paper>
    </Container>
  );
}
