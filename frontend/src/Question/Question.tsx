import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Question.css";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

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

interface Question {
  _id: string;
  title: string;
  frontendQuestionId: string;
  difficulty: string;
  content: string;
  category: string;
  topics: string;
}

export default function Question() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const [question, setQuestion] = useState<Question | null>(null);
  const navigate = useNavigate();

  const fetchDataWithDelay = () => {
    console.log("Fetching data for id:", id);
    
    // Add a delay of, for example, 1000 milliseconds (1 second)
    const delay = 100;
    
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
  
  useEffect(() => {
    fetchDataWithDelay();
  }, [id]);

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
          navigate("/");
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
    navigate(`/`);
  }

  if (question === null) {
    return <div>Loading...</div>;
  }

  // Check if question is defined before accessing its properties
  if (question !== undefined) {
    console.log(question.title);
    return (
      <div>
        <div className="box">
          <div className="rectangle">
            <div className="question-wrapper">
              <h1>{question.title}</h1>
            </div>
            <div className="category-group-wrapper">
              <div className="category-group">
                <p>{question.category}</p>
              </div>
            </div>
            <div className="difficulty-group-wrapper">
              <div className="difficulty-group">
                <p>{question.difficulty}</p>
              </div>
            </div>
            <div className="content-group-wrapper">
              <div className="content-group">
                <div dangerouslySetInnerHTML={{ __html: question.content }} />
              </div>
            </div>
            <div className="button-container">
              <DeleteButton variant="contained" onClick={handleDelete}>
                Delete
              </DeleteButton>
            </div>
            <div className="button-container">
              <Button variant="contained" onClick={handleUpdate}>
                Update
              </Button>
            </div>
            <div className="button-container">
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Question not found.</div>;
  }
}
