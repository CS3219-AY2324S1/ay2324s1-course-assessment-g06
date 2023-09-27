// CodeSpace.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client'; // Import Socket type from 'socket.io-client'

interface Question {
  _id: string;
  title: string;
  frontendQuestionId: string;
  difficulty: string;
  content: string;
  category: string;
  topics: string;
}

const CodeSpace = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const { socketId, difficulty } = location.state || {};
  const [socket, setSocket] = useState<Socket | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);

  const fetchData = () => {
    fetch(`http://localhost:3002/api/room/${roomId}`)
    .then((response) => response.json())
    .then((data) => {
      setQuestion(data)
      console.log(data)
    })
    .catch((error) => {
      console.log(error)
      setQuestion(null)
    });
  };

  useEffect(() => {
    const matchedSocket = io('http://localhost:3002', {
      query: { roomId },
    });

    matchedSocket.on('connect', () => {
      console.log('Connected to matched socket');
    });

    setSocket(matchedSocket);
    fetchData();

    return () => {
      matchedSocket.disconnect();
    };
  }, [roomId]);


  if (question !== null) {
    return (
      <div>
        <h2>Welcome, {socketId || 'Loading...'}</h2>
        <p>
          You are matched with another user using difficulty: {difficulty || 'Not selected'}
        </p>

        <br />
        <br />

      
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
      </div>
    )
  } else {
    return (
      <div>
        <h2>Welcome, {socketId || 'Loading...'}</h2>
        <p>
          You are matched with another user using difficulty: {difficulty || 'Not selected'}
        </p>
      </div>
    )
  }
};

export default CodeSpace;