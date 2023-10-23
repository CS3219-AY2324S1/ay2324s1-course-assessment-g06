import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Location, useNavigate, useBeforeUnload } from 'react-router-dom';
import ReactRouterPrompt from "react-router-prompt";
import useHistory from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { socket } from './socket';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { langNames, langs } from '@uiw/codemirror-extensions-langs';
import ScrollToBottom from 'react-scroll-to-bottom';
import { savesession } from "../../services/save.service";
import { styled } from '@mui/material/styles';
import { Button, Container, Grid, Paper } from '@mui/material';
import './CodeSpace.css';
import logo from '../../images/peerPrepLogo.png';
import PublishIcon from '@mui/icons-material/Publish';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from "@mui/material/CircularProgress";

/////////////////// INTERFACE INITIALISATION  ///////////////////
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
  /////////////////// PARAMETER INITIALISATION  ///////////////////
  const MATCHING_SERVICE_CORS =
    process.env.MATCHING_SERVICE_CORS || 'http://localhost:3002';

  // Id of the current code space room
  const { roomId } = useParams();
  // Get location/path of current page
  let location = useLocation();
  const navigate = useNavigate();

  // To show user the match information
  const { socketId, difficulty, topic, language } = location.state || {};

  // Initilaise the chat message with a connected prompt
  const messageData: ChatMessage = {
    roomId: roomId !== undefined ? roomId : '0',
    author: 'System',
    message: 'You have connected',
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  //////////////// COMPONENT STATE MANAGEMENT INITIALISATION  ////////////////

  // To show the question allocated
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionId, setQuestiondId] = useState("");
  const [questionDifficulty, setQuestiondDifficulty] = useState("");

  // To track if the user has quit the room
  const [hasQuitRoom, setHasQuitRoom] = useState(false);

  // Initilise timer for the collaboration session
  const [timer, setTimer] = useState(10000);
  const [isTimerEnded, setIsTimerEnded] = useState(false);
  const [formattedTime, setformattedTime] = useState("");

  // To track the code text input
  const [code, setCode] = React.useState(() => {
    // Set a default value
    return "Start peer prepping together now!";
  });

  // Check if the dialog to prompt confirmation of quit session is open
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);

  // Check if the other user is still in the session
  const [otherUserQuit, setOtherUserQuit] = useState(false);

  // Check if the dialog to prompt confirmation of submit session is open
  const [isSubmitRequestDialogOpen, setIsSubmitRequestDialogOpen] = useState(false);

  // Check if the dialog to prompt confirmation of submit session is open
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Check if the dialog to show rejected submission is open
  const [isRejectedDialogOpen, setIsRejectedDialogOpen] = useState(false);

  // Check if the dialog to prompt confirmation of submit session upon timer end is open
  const [isTimerEndSubmitDialogOpen, setIsTimerEndSubmitDialogOpen] = useState(false);

  // Check if user is disconnected from the code space
  const [isDisconnectionDialogOpen, setIsDisconnectionDialogOpen] = useState(false);

  // Show user code is submitted
  const [isSubmitteDialogOpen, setIsSubmitteDialogOpen] = useState(false);

  // To hide information if user is not authorised into code space
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);

  // Check if the submission request from one user is pending from other user
  const [submissionRequestPending, setSubmissionRequestPending] = useState(false);
  const [submissionRequestRejected, setSubmissionRequestRejected] = useState(false);
  const [submissionRejectedMessage, setSubmissionRejectedMessage] = useState('');

  /////////////////// PARAMETER INITIALISATION  ///////////////////
  // Initialize the state with an empty array of ChatMessage objects
  const [messageList, setMessageList] = useState<ChatMessage[]>([messageData]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  /////////////////// HANDLE DIALOG OPEN OR CLOSE  ///////////////////
  // To open of close the confirm quit session modal/dialog
  const openQuitDialog = () => {
    setIsQuitDialogOpen(true);
  };

  const closeQuitDialog = () => {
    setIsQuitDialogOpen(false);
  };

  // Handle submit button click
  const openSubmitDialog = () => {
    setIsSubmitDialogOpen(true);
  };

  const closeSubmitDialog = () => {
    setIsSubmitDialogOpen(false);
  };

  // Handle timer end dialog for submission
  const openTimerEndSubmitDialog = () => {
    setIsTimerEndSubmitDialogOpen(true);
  };

  const closeTimerEndSubmitDialog = () => {
    setIsTimerEndSubmitDialogOpen(false);
    navigate("/matching");
    socket.emit('timerEnd', roomId);
  };

  // Handle timer end dialog for submission
  const openSubmitRequestDialog = () => {
    setIsSubmitRequestDialogOpen(true);
  };

  const closeSubmitRequestDialog = () => {
    setIsSubmitRequestDialogOpen(false);
  };

  // Debounce timer to control when to emit "user typing" event
  let typingTimer: NodeJS.Timeout;

  // To handle user changing path from match
  useEffect(() => {
    function handleOnBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasQuitRoom) {
        event.preventDefault();
        event.returnValue = "";
        // Prompt the user with your disconnection dialog
        // usePrompt({message: "Are you sure you want to leave?",
        // when: true})
        // openDisconnectionDialog(); // Call your function to display the dialog
      }
    }

    // Attach the 'beforeunload' event listener
    window.addEventListener('beforeunload', handleOnBeforeUnload, { capture: true });

    return () => {
      // Remove the 'beforeunload' event listener when the component unmounts
      window.removeEventListener('beforeunload', handleOnBeforeUnload, { capture: true });
    };
  }, [location]);

  // Update timer for session
  useEffect(() => {
    if (!isTimerEnded) {
      const startTime = performance.now(); // Get the current time when the timer starts
      const tick = () => {
        const currentTime = performance.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed seconds

        if (elapsed < timer) {
          const hours = Math.floor((timer - elapsed) / 3600);
          const minutes = Math.floor(((timer - elapsed) % 3600) / 60);
          const remainingSeconds = (timer - elapsed) % 60;
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
          setformattedTime(formattedTime);
          requestAnimationFrame(tick); // Schedule the next tick
        } else {
          setformattedTime('00:00:00');
          setTimer(0);
          setIsTimerEnded(true);
        }
      };

      const timerInterval = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(timerInterval);
      };
    }
  }, [timer, isTimerEnded]);


  useEffect(() => {
    if (isTimerEnded && socket) {
      // Open submission prompt dialog on timer end
      openTimerEndSubmitDialog();
    }
  }, [isTimerEnded, roomId, socket]);

  function wrapPreTags(content: string) {
    const wrappedContent = content.replace(/<pre>/g, '<pre class="pre-wrap">');
    return wrappedContent;
  }


  // Set default code in space after match according to language
  useEffect(() => {
    if (language == 'python') {
      setCode("# " + code);
    } else {
      setCode("// " + code);
    }
  }, [language]);

  useEffect(() => {
    // Handle all socket events listened from server
    if (socket) {
      console.log("connected to socket", socket, socket.id);
      const matchedSocket = socket;
      // Below change then wont work properly
      // const matchedSocket = io(MATCHING_SERVICE_CORS, {query: { roomId }});

      // Handle for initial connection event from server
      matchedSocket.on('connect', () => {
        console.log('Connected to matched socket');
        // Emit the "userConnected" event when the socket connects
        matchedSocket.emit('userConnected', socketId, roomId);
        // Emit the "joinRoom" event when the socket connects
        matchedSocket.emit('joinRoom', roomId);
      });

      // Listen for 'codeChange' events from the server
      matchedSocket.on('codeChange', (newCode: string) => {
        setCode(newCode); // Update the value with the new code
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
        setIsAccessAllowed(true);

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

      matchedSocket.on('sessionEnded', () => {
        alert('The session has ended');
        setHasQuitRoom(true);
        navigate("/matching");

        return () => {
          matchedSocket.off("sessionEnded");
        };
      })

      matchedSocket.on('quitSession', () => {
        setOtherUserQuit(true);
        openQuitDialog(); // Open the confirmation dialog
      });

      matchedSocket.on('requestSubmitSession', () => {
        openSubmitRequestDialog();
      });

      // Handle submission request rejection
      matchedSocket.on('rejectSubmitRequest', () => {
        setSubmissionRequestPending(false); // Set submission request as not pending
        closeSubmitDialog();
        closeSubmitRequestDialog(); // Close the submission request dialog
        setSubmissionRejectedMessage("The submission request has been rejected.");
        setIsRejectedDialogOpen(true);
      });

      matchedSocket.on('submitSession', (questionIdFromServer, questionDifficultyFromServer) => {
        // alert('The session has been submitted');
        saveSessionHistory(questionIdFromServer, questionDifficultyFromServer);
        setHasQuitRoom(true);
        navigate("/matching");

        return () => {
          matchedSocket.off("submitSession");
        };
      })

      // Handle disconnection event
      matchedSocket.on('userDisconnected', (roomId) => {
        // if (isTimerEndSubmitDialogOpen) {
        //   alert('The other user has disconnected');
        //   navigate("/matching");
        // }
        // openDisconnectionDialog();

        // Send a message to the chat when a user disconnects
        const messageData: ChatMessage = {
          roomId: roomId !== undefined ? roomId : "0", // Make sure roomId is always defined
          author: 'System',
          message: `A user has disconnected`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setHasQuitRoom(true);
        setMessageList((list) => [...list, messageData]);

        // alert('The other user has disconnected');
        // navigate("/matching");

        setOtherUserQuit(true);
        openQuitDialog(); // Open the confirmation dialog

        return () => {
          matchedSocket.off('userDisconnected', (roomId))
        };
      });

      // Listen for 'accessDenied' events from server indicating an unauthorised (but logged in) user trying to access a room they are not matched/allowed in
      matchedSocket.on('accessDenied', (message) => {
        setIsAccessAllowed(false);
        alert(message);
        navigate("/matching");
      });

      fetchData();

      return () => {
        matchedSocket.disconnect();
      };
    }
  }, [roomId]);

  /////////////////// SET UP EVENT HANDLERS  ///////////////////

  // On change handlers
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
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      if (socket) {
        socket.emit('sendMessage', messageData);
      }
      // Clear the input field
      setNewMessage('');
    }
  };

  // Handle quit session logic
  const handleQuitSession = () => {
    if (socket) {
      // Emit a "quitSession" event to the server
      socket.emit('quitSession', roomId);
    }
    console.log("quitting session");

    // alert('You have quit the session');
    navigate("/matching");
  };

  // Handle submit session logic
  const handleSubmitSession = () => {
    if (socket) {
      // Emit a "submitSession" event to the server
      socket.emit('submitSession', roomId, questionId, questionDifficulty);
    }

    closeSubmitRequestDialog();
    console.log("submitting session");

    saveSessionHistory(questionId, questionDifficulty);

    // alert("You have submitted the session.");
    navigate("/matching");
  };

  // Handle request submit session logic
  const handleRequestSubmitSession = () => {
    if (socket) {
      // Emit a "submitSession" event to the server
      socket.emit('requestSubmitSession', roomId, questionId, questionDifficulty, otherUserQuit);
    }
    setSubmissionRequestPending(true);
  };

  const handleRejectSubmitRequest = () => {
    if (socket) {
      // Emit a "rejectSubmitRequest" event to the server
      socket.emit('rejectSubmitRequest', roomId);
    }
    setSubmissionRequestPending(false); // Set submission request as not pending
    closeSubmitRequestDialog(); // Close the submission request dialog

    // Set the rejection message
    setSubmissionRequestRejected(true);
  };

  // Handle submit session on timer end logic
  const handleSubmitOnTimerEndSession = () => {
    if (socket) {
      // Emit a "submitSession" event to the server
      socket.emit('submitIndividualSession', roomId, questionId, questionDifficulty);
    }
    console.log("submitting session");
    saveSessionHistory(questionId, questionDifficulty);
    // alert("You have submitted the session.");
    navigate("/matching");
  };

  // Handle submit session on timer end logic
  const handleDisconnection = () => {
    // TO ADD IN
  };

  // Handle code change events
  const onChange = React.useCallback((code: string, viewUpdate: any) => {
    setCode(code);
    // Emit the 'codeChange' event to the server only if it's a change by this client
    if (socket) {
      socket.emit('codeChange', code, roomId); // Pass roomId or any identifier
    }
  }, [socket, roomId]);

  const fetchData = async () => {
    // Check if the room is active
    try {
      const response = await fetch(MATCHING_SERVICE_CORS + `/api/room/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestion(data);
        setQuestiondId(data._id);
        setQuestiondDifficulty(data.difficulty);
        console.log("question is ", data);
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

  // Set the code syntax
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

  const saveSessionHistory = (questionId: string, questionDifficulty: string) => {
    console.log("submitting session");
    savesession(questionId, questionDifficulty, code).then(
      (response) => {
        setMessage(response.data.message);
        console.log("message:", message);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log("Error in submission: ", resMessage);
      }
    );
  };

  /////////////////// HANDLE FRONTEND COMPONENTS  ///////////////////

  return (

    <div style={{ backgroundColor: '#white', padding: '15px' }}>
      <div className='p-2 row'>
        {/* Logo */}
        <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-start">
          <img src={logo} alt="Logo" height="43.76" width="140" className="mr-3" />
        </div>

        {/* Timer */}
        <div className="col-12 col-md-2 d-flex justify-content-center">
          <span className="timer">{formattedTime}</span>
        </div>

        {/* Buttons */}
        <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end pr-0">
          {/* Submit Button */}
          <button className="submit-button mx-2" onClick={openSubmitDialog}>
            <PublishIcon />
            <span className="pr-1">Submit</span>
          </button>

          {/* Quit Button */}
          <button className="quit-button mx-2" onClick={openQuitDialog}>
            <LogoutIcon />
            <span className="pr-1">Quit Session</span>
          </button>
        </div>
      </div>



      {/* <h2>Welcome, {socketId || 'Loading...'}</h2> */}
      {/* Match Information */}
      {/* <p>
        You are matched with another user using difficulty:{' '}
        {difficulty || 'Not selected'}, topic: {topic || 'Not selected'} and
        language: {language || 'Not selected'}
      </p>
      <div className="timer">Time left: {formattedTime} minutes</div> */}


      <div className='container' style={{ maxWidth: '100%', margin: '0 auto', padding: '0' }}>
        <div className='row'>
          <div className='col-12 col-md-5'>
            {/* Question */}
            {question !== null ? (
              <Container
                maxWidth="lg"
                className='mt-3'
                style={{
                  margin: '0 auto',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  width: '100%',
                  maxWidth: '100%',
                  minHeight: '950px',
                  height: '950px',
                  maxHeight: '950px',
                  padding: '0',
                  border: '1px solid #ccc',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Header */}
                <div className="card-header">
                  Question
                </div>

                <Grid sx={{ flexGrow: 1 }} container spacing={1}>
                  <Grid item xs={12} container justifyContent="space-between">
                    <div>
                      <h1 style={{ fontSize: '25px', fontWeight: 'bold', padding: '10px 20px 0px 20px' }}>
                        {question.title}
                      </h1>
                    </div>
                  </Grid>


                  <div className='container ml-0 mb-3' style={{ maxWidth: '100%', padding: '10px 28px 0px' }}>
                    <div className='difficulty-tag'>{difficulty}</div>
                    <div className='topic-tag'>{topic}</div>
                  </div>

                  <hr/>


                  {/* Hide these tags when the width of the screen is smal */}
                  {/* {window.innerWidth > 940 && (
                    <>
                      <Grid item xs={1.5}>
                        <CategoryWrapper>{question.difficulty}</CategoryWrapper>
                      </Grid>

                      {question.topics.split(', ').map((topic, index) => (
                        <Grid
                          item
                          xs={topic.length < 10 ? 1.5 : topic.length < 14 ? 2 : 3}
                          key={index}
                        >
                          <QuestionWrapper>{topic}</QuestionWrapper>
                        </Grid>
                      ))}
                    </>
                  )} */}

                  <Container maxWidth="lg" style={{ marginTop: '25px' }}>
                    <Grid item xs={12}>
                      <div
                        className="content-wrapper"
                        style={{ overflow: 'auto', maxHeight: '775px' }}
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
              </Container>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress color="inherit" />
              </div>
            )}

          </div>

          <br />

          <div className='col-12 col-md-7'>
            <div className='codespace mt-3'>
              <div className="card-header">
                Code
              </div>
              <CodeMirror
                value={code}
                height="500px"
                onChange={onChange}
                extensions={getCodeMirrorExtensions()}
              />
            </div>
            {/* Coding Space */}


            <br />


            {/* Chat UI */}
            <div className="chat-container" style={{ backgroundColor: 'white' }}>
              <div className="card-header">
                Chat
              </div>
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
          </div>
        </div>

        {/* Quit Session Dialog/Modal */}
        <div className="modal" tabIndex={-1} role="dialog" style={{ display: isQuitDialogOpen ? 'block' : 'none' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{"Confirm Quit"}</h5>
                <button type="button" className="close" onClick={closeQuitDialog}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              {/* Quit Session Message */}
              <div className="modal-body">
                {otherUserQuit ? (
                  <p>The other user has left the session. Do you want to leave the session?</p>
                ) : (
                  <p>Are you sure you want to quit this session?</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (otherUserQuit) {
                      // Close dialog and set other user quit to false to reset the message when the remaining user click on quit session again
                      closeQuitDialog();
                      // Removing logic as it prevents the other user from submitting the sessino if their peer has quit
                      // setOtherUserQuit(false);
                    } else {
                      // Close the dialog
                      closeQuitDialog();
                    }
                  }}
                >
                  {otherUserQuit ? "Continue" : "Cancel"}
                </button>
                <button type="button" className="btn btn-danger" onClick={handleQuitSession}>
                  {otherUserQuit ? "Leave" : "Quit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Request Dialog/Modal */}
      <div className="modal" tabIndex={-1} role="dialog" style={{ display: isSubmitRequestDialogOpen ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Submit Request</h5>
              <button type="button" className="close" onClick={() => closeSubmitRequestDialog()}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>The other user has requested to submit the session. Do you accept?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => handleRejectSubmitRequest()}>Reject</button>
              <button type="button" className="btn btn-danger" onClick={() => handleSubmitSession()}>Accept</button>
            </div>
          </div>
        </div>
      </div>


      {/* Submit Session Dialog/Modal */}
      <div className="modal" tabIndex={-1} role="dialog" style={{ display: isSubmitDialogOpen ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Submission</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeSubmitDialog}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {submissionRequestPending ? (
                <p>Submission request is pending. Waiting for the other user's response...</p>
              ) : (
                <p>Are you sure you want to submit this session?</p>
              )}
            </div>
            {!submissionRequestPending ? (
              <div className="modal-footer">

                <button type="button" className="btn btn-danger"
                  onClick={() => {
                    if (otherUserQuit) {
                      handleSubmitSession();
                    } else {
                      handleRequestSubmitSession();
                    }
                  }}>Submit</button>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Request Rejected Dialog/Modal */}
      <div className="modal" tabIndex={-1} role="dialog" style={{ display: isRejectedDialogOpen ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Submission Request Rejected</h5>
              <button type="button" className="close" onClick={() => setIsRejectedDialogOpen(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>{submissionRejectedMessage}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsRejectedDialogOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timer End Prompt Submit Session Dialog/Modal */}
      <div className="modal" tabIndex={-1} role="dialog" style={{ display: isTimerEndSubmitDialogOpen ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Submission</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeTimerEndSubmitDialog}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>The time has ended. Do you want to submit your code?</p>
              <p>Note: Your choice of no submission will not affect the other user's choice of submission.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleSubmitOnTimerEndSession}>Yes</button>
              <button type="button" className="btn btn-danger" onClick={closeTimerEndSubmitDialog}>No</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CodeSpace;
