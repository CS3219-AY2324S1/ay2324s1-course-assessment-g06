import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Question.css";

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

  const fetchData = () => {
    console.log("Fetching data for id:", id);
    fetch(
      `http://localhost:3000/api/questions/${id}`
    )
      .then((response) => response.json())
      .then((responseData) => {
        setQuestion(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setQuestion(null);
      });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Question not found.</div>;
  }
}
