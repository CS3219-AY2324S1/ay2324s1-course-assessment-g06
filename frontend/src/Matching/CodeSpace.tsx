import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { langNames, langs } from '@uiw/codemirror-extensions-langs';

console.log('langNames:', langNames); // To show the available language supported by codemirror

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
  const [value, setValue] = React.useState(() => {
    // Retrieve the code value from localStorage or set a default value
    return localStorage.getItem('code') || "console.log('hello world!')";
  });
  const [selectedLanguage, setSelectedLanguage] = useState('c'); // Default language is C

  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    console.log('val:', val);
    setValue(val);
// Save the code value to localStorage
    localStorage.setItem('code', val);
    // Emit the 'codeChange' event to the server only if it's a change by this client
    if (socket) {
      socket.emit('codeChange', val, roomId); // Pass roomId or any identifier
      console.log('emitting codeChange from client');
    }
  }, [socket, roomId]);

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

    // Listen for 'languageChange' events from the server
    matchedSocket.on('languageChange', (newLanguage: string) => {
      console.log('receive language from server');
      setSelectedLanguage(newLanguage); // Update the selected language
    });

    setSocket(matchedSocket);
    fetchData();

    return () => {
      matchedSocket.disconnect();
    };
  }, [roomId]);

  const handleLanguageChange = (selectedLanguage: string) => {
    console.log(selectedLanguage)
    setSelectedLanguage(selectedLanguage);
    // Emit a 'languageChange' event to the server to inform other users
    if (socket) {
      socket.emit('languageChange', selectedLanguage, roomId);
    }
  };

  const getCodeMirrorExtensions = () => {
    switch (selectedLanguage) {
      case 'python':
        return [langs.python()];
      case 'java':
        return [langs.java()];
      default:
        return [javascript()]; // Default to JavaScript if none selected
    }
  };

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
        <label>Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="ruby">Ruby</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      <div>
        <CodeMirror
          value={value}
          height="200px"
          onChange={onChange}
          extensions={getCodeMirrorExtensions()}
        />
      </div>
    </div>
  );
};

export default CodeSpace;
