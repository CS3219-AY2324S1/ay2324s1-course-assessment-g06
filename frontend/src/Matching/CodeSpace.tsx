import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { langNames, langs } from '@uiw/codemirror-extensions-langs';
import ScrollToBottom from 'react-scroll-to-bottom';
import './CodeSpace.css'; 

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

// Define type for chat messages
interface ChatMessage {
  roomId: string;
  author: string;
  message: string;
  time: string;
}


const CodeSpace = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const { socketId, difficulty } = location.state || {};
  const [socket, setSocket] = useState<Socket | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [value, setValue] = React.useState(() => {
    // Retrieve the code value from localStorage or set a default value
    return localStorage.getItem('code') || "console.log('hello world!')";
  });
  const [selectedLanguage, setSelectedLanguage] = useState('c'); // Default language is C
  // Initialize the state with an empty array of ChatMessage objects
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessageChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage !== '') {
      const messageData = {
        roomId: roomId,
        author: socketId,
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
  
      if (socket) {
        socket.emit('sendMessage', messageData);
      }

      // Clear the input field
      setNewMessage('');

    }

  };

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

    // Listen for 'receive message' events from the server
    matchedSocket.on('receiveMessage', (data) => {
      console.log('receiveMessage from server');
      setMessageList((list) => [...list, data]); // Update the selected language
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

            <br/>
            <br/>
            <br/>


            {/* Chat UI */}
            <div className="chat-container mb-5" style={{ backgroundColor: 'white' }}> {/* Added inline style */}
              <h2>Chat</h2>
              <div className="chat-messages">
                <ScrollToBottom className='message-container'>
                {messageList.map((messageContent, index) => (
                  <div key={index} className="chat-message" id={socketId === messageContent.author ? "own" : "other"}>
                    <div className='message-content'>
                      {messageContent.message}
                    </div>
                    <div className='message-meta'>
                      {messageContent.time}
                    </div>
                  </div>
                ))}
                </ScrollToBottom>
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={handleNewMessageChange}
                  onKeyPress={(event) => event.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
      </div>
    </div>
  );
};

export default CodeSpace;
