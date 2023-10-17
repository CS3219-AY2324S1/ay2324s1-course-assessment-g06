import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Question.css";
import { styled } from "@mui/material/styles";
import { Button, Container, Grid, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import { getCurrentUser } from "../services/auth.service";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as DialogButton,
} from "@mui/material";

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
  fontSize: "12px",
  // Media query for smaller screens
  '@media (max-width: 1200px)': {
    fontSize: "10px", // Decrease font size for smaller screens
  },
}));

const CategoryWrapper = styled(Container)(({ theme }) => ({
  backgroundColor: "rgb(255, 192, 203)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  fontWeight: "bold",
  textAlign: "center",
  borderRadius: "50px",
  fontSize: "12px",
    // Media query for smaller screens
    '@media (max-width: 1200px)': {
      fontSize: "10px", // Decrease font size for smaller screens
    },
}));

const CustomDialog = styled(Dialog)`
`;

const CustomDialogTitle = styled(DialogTitle)`
  font-weight: bold
`;

const CustomDialogContent = styled(DialogContent)`
  padding: 20px;
`;

const CustomDialogActions = styled(DialogActions)`
  justify-content: space-between;
`;

const BackButton = styled(Button)`
  background-color: #d8d8d8;
  color: white;
  font-weight: bold;
  &:hover {
    background-color: #6C63FF;
  }
`;

export default function Question() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<QuestionInt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Confirmation dialog state

  useEffect(() => {
    const fetchDataWithDelay = () => {
      fetch(`http://localhost:3000/api/questions/${id}`)
        .then((response) => response.json())
        .then((responseData) => {
          setQuestion(responseData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setQuestion(null);
          setIsLoading(false);
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

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleUpdate = () => {
    navigate(`/questions/${id}/update`);
  };

  const handleDelete = () => {
    // Close the confirmation dialog
    closeDeleteDialog();

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

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }

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
      <Paper
        style={{
          padding: "20px",
          borderRadius: "15px",
        }}
      >
        <Grid sx={{ flexGrow: 1 }} container spacing={1}>
          <Grid item xs={12} container justifyContent="space-between">
            <div>
              <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>
                {question.title}
              </h1>
            </div>
            <div>
              {isAdmin && (
                <>
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
                    onClick={openDeleteDialog}
                  >
                    <DeleteIcon />
                  </Button>
                </>
              )}
            </div>
          </Grid>

          <Grid item xs={1.5}>
            <CategoryWrapper>{question.difficulty}</CategoryWrapper>
          </Grid>

          {question.topics.split(', ').map((topic, index) => (
            <Grid item xs={topic.length < 10 ? 1.5 : topic.length < 14 ? 2 : 3} key={index}>
              <QuestionWrapper>{topic}</QuestionWrapper>
            </Grid>
          ))}

          <Container maxWidth="lg" style={{ marginTop: "25px" }}>
            <Grid item xs={12}>
              <div
                className="content-wrapper"
                style={{ overflow: "auto", maxHeight: "350px" }}
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
    
      <CustomDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ sx: { bgcolor: "lightgray", borderRadius: "20px", padding: "5px" } }}
      >
        <CustomDialogTitle id="alert-dialog-title">Confirm Deletion</CustomDialogTitle>
        <CustomDialogContent>  
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this question?
            </DialogContentText>
        </CustomDialogContent>
        <CustomDialogActions sx={{ justifyContent: 'space-between' }}>
          <DialogButton
            onClick={closeDeleteDialog}
            style={{ fontSize: "18px", backgroundColor: 'white', borderRadius: '15px', color: 'black', textTransform: 'none',  margin: '0 auto'  }}
          >
            Cancel
          </DialogButton>
          <DialogButton
            onClick={handleDelete}
            autoFocus
            style={{ fontSize: "18px", backgroundColor: '#FF6A6A', borderRadius: '15px', color: 'white', textTransform: 'none', margin: '0 auto' }}
          >
            Delete
          </DialogButton>
        </CustomDialogActions>
      </CustomDialog>
      <Grid item xs={12}>

      <BackButton
          sx={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            height: '32 px',
            fontSize: '25px',
            borderRadius: '40px',
            minWidth: '40px', // Set the minimum width
            maxWidth: '40px',  // Set the maximum width
          }}
          variant="contained"
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </BackButton>
        </Grid>

  </Container>
  );
}
