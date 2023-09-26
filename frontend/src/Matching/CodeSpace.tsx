import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

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
  const [code, setCode] = useState("console.log('hello world!');");
  const [value, setValue] = React.useState("console.log('hello world!');");

  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log('val:', val);
    setValue(val);
  
    // Emit the 'codeChange' event to the server only if it's a change by this client
    if (socket) {
      socket.emit('codeChange', val, roomId); // Pass roomId or any identifier
      console.log('emiting codechange from client');
    }
  }, [socket]);

  const fetchData = () => {
    fetch(`http://localhost:3002/api/room/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        setQuestion(null);
      });
  };

  useEffect(() => {
    // Create a socket connection
    const matchedSocket = io('http://localhost:3002', {
      query: { roomId },
    });

    matchedSocket.on('connect', () => {
      console.log('Connected to matched socket');
      console.log(matchedSocket);

      // Emit the "joinRoom" event when the socket connects
      matchedSocket.emit('joinRoom', roomId);
    });

    // Listen for 'codeChange' events from the server
    matchedSocket.on('codeChange', (newCode: string) => {
      setValue(newCode); // Update the value with the new code
    });

    setSocket(matchedSocket);
    fetchData();

    return () => {
      matchedSocket.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <h2>Welcome, {socketId || 'Loading...'}</h2>
      <p>
        You are matched with another user using difficulty: {difficulty || 'Not selected'}
      </p>

      <br />
      <br />

      {question !== null ? (
        <div>
          <div>
            <h1>{question.title}</h1>
            <p>Category: {question.category}</p>
            <p>Difficulty: {question.difficulty}</p>
            <div dangerouslySetInnerHTML={{ __html: question.content }} />
          </div>
        </div>
      ) : (
        <p>Loading question...</p>
      )}

      <br />
      <br />

      <div>
        <CodeMirror value={value} height="200px" onChange={onChange} />
      </div>
    </div>
  );
};

export default CodeSpace;
