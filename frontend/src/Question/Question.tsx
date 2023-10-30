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

const CustomDialog = styled(Dialog)``;

const CustomDialogTitle = styled(DialogTitle)`
  font-weight: bold;
`;

const CustomDialogContent = styled(DialogContent)`
  padding: 20px;
`;

const CustomDialogActions = styled(DialogActions)`
  justify-content: space-between;
`;

const BackButton = styled(Button)`
  background-color: #6c63ff;
  color: white;
  font-weight: bold;
`;

export default function Question() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<QuestionInt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Confirmation dialog state
  const QUESTION_HOST =
    process.env.REACT_APP_QNS_SVC || "http://localhost:3000/api/questions";

  useEffect(() => {
    const fetchDataWithDelay = () => {
      fetch(QUESTION_HOST + `/${id}`, {
        headers: {
          "x-access-token": currentUser.accessToken,
        },
      })
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
  }, [id, currentUser.accessToken]);

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

    fetch(QUESTION_HOST + `/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": currentUser.accessToken,
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    );
  }

  if (question === null) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress color="inherit" />
    </div>;
      }

  return (
    <div
      className="mb-3"
      style={{
        margin: "10px",
        backgroundColor: "#E6E6E6",
        borderRadius: "20px",
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
              <h1
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  paddingLeft: "10px",
                }}
              >
                {question.title}
              </h1>
            </div>
            <div className="mb-3 ml-2">
              {isAdmin && (
                <>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#6C63FF",
                      borderRadius: "50px",
                      fontSize: "10px",
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
                      borderRadius: "50px",
                      fontSize: "10px",
                    }}
                    onClick={openDeleteDialog}
                  >
                    <DeleteIcon />
                  </Button>
                </>
              )}
            </div>
          </Grid>

          {/* Tags */}
          <div className="question-tag-container row-md-1">
            <div className="difficulty-tag">{question.difficulty}</div>
            {question.topics.split(", ").map((topic, index) => (
              <div className="topic-tag">{topic}</div>
            ))}
          </div>

          <Container className="pl-3">
            <Grid item xs={12}>
              <div
                className="content-wrapper pl-0"
                style={{ overflow: "auto", maxHeight: "420px" }}
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
        PaperProps={{
          sx: { bgcolor: "white", borderRadius: "20px", padding: "5px" },
        }}
      >
        <CustomDialogTitle id="alert-dialog-title">
          Confirm Deletion
        </CustomDialogTitle>
        <CustomDialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this question?
          </DialogContentText>
        </CustomDialogContent>
        <CustomDialogActions sx={{ justifyContent: "space-between" }}>
          <DialogButton
            onClick={closeDeleteDialog}
            style={{
              fontSize: "18px",
              backgroundColor: "#d8d8d8",
              borderRadius: "15px",
              color: "black",
              textTransform: "none",
              margin: "0 auto",
            }}
          >
            Cancel
          </DialogButton>
          <DialogButton
            onClick={handleDelete}
            autoFocus
            style={{
              fontSize: "18px",
              backgroundColor: "#FF6A6A",
              borderRadius: "15px",
              color: "white",
              textTransform: "none",
              margin: "0 auto",
            }}
          >
            Delete
          </DialogButton>
        </CustomDialogActions>
      </CustomDialog>
      <Grid item xs={12}>
        <BackButton
          sx={{
            position: "fixed",
            bottom: "30px",
            left: "30px",
            height: "32 px",
            fontSize: "25px",
            borderRadius: "40px",
            minWidth: "40px", // Set the minimum width
            maxWidth: "40px", // Set the maximum width
          }}
          variant="contained"
          onClick={handleBack}
        >
          <ArrowBackIcon />
        </BackButton>
      </Grid>
    </div>
  );
}
