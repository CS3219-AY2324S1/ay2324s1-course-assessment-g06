import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { socket } from './socket';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { langNames, langs } from '@uiw/codemirror-extensions-langs';
import ScrollToBottom from 'react-scroll-to-bottom';
import './CodeSpace.css'; 

import {Grid, Container, Card } from '@mui/material';

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
  const navigate = useNavigate();
  const { socketId, difficulty, topic , language} = location.state || {};
  // const [socket, setSocket] = useState<Socket | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [hasQuitRoom, setHasQuitRoom] = useState(false); // Track if the user has quit the room
  const [value, setValue] = React.useState(() => {
    // Retrieve the code value from localStorage or set a default value
    return localStorage.getItem('code') || "console.log('hello world!')";
  });

  const messageData: ChatMessage = {
    roomId: roomId !== undefined ? roomId : "0", 
    author: 'System', 
    message: 'You have connected',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Initialize the state with an empty array of ChatMessage objects
  const [messageList, setMessageList] = useState<ChatMessage[]>([messageData]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Debounce timer to control when to emit "user typing" event
  let typingTimer: NodeJS.Timeout;
  ;

  const handleNewMessageChange = (e: any) => {
    setNewMessage(e.target.value);

    // Clear the previous typing timer
    clearTimeout(typingTimer);

    // Set a new timer to indicate typing after a delay
    typingTimer = setTimeout(() => {
      // Emit "user typing" event to the server
      if (socket) {
        socket.emit('userTyping', roomId, false);
      }
    }, 1000); // Adjust the delay as needed
  };

  const handleStartTyping = () => {
    // Emit "user typing" event to the server
    if (socket) {
      socket.emit('userTyping', roomId, true);
    }
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

  const fetchData = async () => {
    // Check if the room is active
    try {
      const response = await fetch(`http://localhost:3002/api/room/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestion(data);
        console.log(data);
      } else {
        console.error('Error fetching room data:', response.status);
        navigate("/404"); // Redirect to the 404 error page
      }
    } catch (error) {
      // Room is not active and the 404 page is shown
      console.error('Error fetching room data:', error);
      navigate("/404"); // Redirect to the 404 error page
    }
  };

  useEffect(() => {

    // Create a socket connection
    // const matchedSocket = io('http://localhost:3002', {
    //   query: { roomId },
    // });
    if (socket) {
      console.log("connected to socket", socket, socket.id);
      const matchedSocket = socket;

      matchedSocket.on('sessionEnded', () => {
        console.log("session has ended")
        navigate("/404");
      })

      matchedSocket.on('connect', () => {
        console.log('Connected to matched socket');

        // Emit the "userConnected" event when the socket connects
        matchedSocket.emit('userConnected', socketId, roomId);
        // Emit the "joinRoom" event when the socket connects
        matchedSocket.emit('joinRoom', roomId);
      });

      // Handle disconnection event
      matchedSocket.on('userDisconnected', () => {
        console.log('user disconnected from client')
        // Emit a custom event to inform the server or other clients
        matchedSocket.emit('userDisconnected', roomId);
      });

      // Listen for 'codeChange' events from the server
      matchedSocket.on('codeChange', (newCode: string) => {
        setValue(newCode); // Update the value with the new code
      });

      // Listen for 'receive message' events from the server
      matchedSocket.on('receiveMessage', (data) => {
        console.log('receiveMessage from server');
        setMessageList((list) => [...list, data]); // Update the selected language
      }); 

      // Listen for 'userTyping' events from the server
      matchedSocket.on('userTyping', (isTyping) => {
        setIsTyping(isTyping);
      });

      // Listen for 'userConnected' and 'userDisconnected' events from the server
      matchedSocket.on('userConnected', (connectedSocket) => {
        console.log('receive userConnected from server');
        console.log("current" + socketId)
        console.log("connected" + connectedSocket)

        if (connectedSocket !== socketId) {
        // Send a message to the chat when another user connects
        const messageData: ChatMessage = {
          roomId: roomId !== undefined ? roomId : "0", // Make sure roomId is always defined
          author: 'System', 
          // message: `A user (${connectedSocket}) has connected`,
          message: `A user has connected`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessageList((list) => [...list, messageData]);
        }
      });

      // // Listen for the 'sessionEnded' event from the server
      matchedSocket.on('sessionEnded', () => {
        // Handle the session ending, display a message, or redirect users
        alert('The session has ended');
        setHasQuitRoom(true);
        
        return () => {
          matchedSocket.off("sessionEnded");
        };
      });

      // Might not be able to work due to current implementation and window closes terminates socket abruptly
      matchedSocket.on('userDisconnected', () => {
        // Send a message to the chat when a user disconnects
        const messageData: ChatMessage = {
          roomId: roomId !== undefined ? roomId : "0", // Make sure roomId is always defined
          author: 'System', 
          message: `A user has disconnected`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessageList((list) => [...list, messageData]);
      });

      fetchData();

      return () => {
        matchedSocket.disconnect();
      };
    }
  }, [roomId]);

  const getCodeMirrorExtensions = () => {
    switch (language) {
      case 'python':
        return [langs.python()];
      case 'java':
        return [langs.java()];
      default:
        return [javascript()]; // Default to JavaScript if none selected
    }
  };

  const handleQuitSession = () => {
    if (socket) {
      // Emit a "quitSession" event to the server
      socket.emit('quitSession', roomId);
    }
    console.log("quitting session");
    navigate("/404");
  }

  return (
    <div className="container mt-5" >
      <h2>Welcome, {socketId || 'Loading...'}</h2>
      <p>
        You are matched with another user using difficulty: {difficulty || 'Not selected'}, topic: {topic || 'Not selected'} and language: {language || 'Not selected'}
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
        <div className="chat-container mb-5" style={{ backgroundColor: 'white' }}> 
          <h2>Chat</h2>
          <div className="chat-messages">
            <ScrollToBottom className='message-container'>
            {messageList.map((messageContent, index) => (
              <div key={index} className="chat-message" id={socketId === messageContent.author ? "own" : "System" === messageContent.author ? "system" : "other"}>
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
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSendMessage();
                } else {
                  handleStartTyping(); 
                }
              }}
            />
            {isTyping && <div className="typing-indicator">Typing...</div>}
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>

        <div className = "col-md-5">
          <button className="quit-button" onClick={handleQuitSession}>
              Quit Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSpace;
