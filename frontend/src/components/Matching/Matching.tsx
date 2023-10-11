import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './Matching.css';
import { iconCategories } from './IconMatching'; 
import { langNames } from '@uiw/codemirror-extensions-langs';

console.log(langNames); 

// Cast the socket to the CustomSocket type
const customSocket = socket as CustomSocket;

const scrollableContainerStyle = {
  overflowX: 'scroll', // Enable horizontal scrolling
  display: 'flex',     // Make the content flex
  flexWrap: 'wrap',    // Wrap items to the next line when they exceed the container width
};

// Define a custom interface that extends the Socket interface
interface CustomSocket extends Socket {
  timerId?: NodeJS.Timer | null;
}

const Matchmaking: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [matchStatus, setMatchStatus] = useState<string>('');
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Easy');
  const [selectedTopic, setSelectedTopic] = useState<string>('Array');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer | null>(null);
  const [isMatchFound, setIsMatchFound] = useState<boolean>(false); // Track if a match is found
  const navigate = useNavigate();

  useEffect(() => {
    function onConnect() {
      if (isMatching) {
        setIsMatching(false);
      }
      setIsConnected(true);
    }

    function onDisconnect() {
      if (isMatching) {
        setIsMatching(false);
      }
      setIsConnected(false);
    }

    function matchFound(roomId: string, msg: string) {
      setIsMatchFound(true); // Set match found to true
      setMatchStatus(msg);
      // Clear the timer stored on the socket object
      if (customSocket.timerId) {
        clearInterval(customSocket.timerId);
        customSocket.timerId = null;
      }

      setTimeout(() => {
        setIsMatching(false);
        navigate(`/match/${roomId}`, {
          state: { socketId: socket.id, difficulty: selectedDifficulty },
        });
      }, 2000); // 2 seconds delay
    }

    // Handle match canceled event
    function matchCanceled() {
      setIsMatching(false);
      // Clear the timer stored on the socket object
      if (customSocket.timerId) {
        clearInterval(customSocket.timerId);
        customSocket.timerId = null;
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('match found', matchFound);
    socket.on('match canceled', matchCanceled); // Listen for match canceled event

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('match found', matchFound);
      socket.off('match canceled', matchCanceled); // Remove the event listener
    };
  }, [selectedDifficulty]);

  const startTimer = () => {
    if (timerInterval === null) {
      console.log('start timer');
      let seconds = 0;
      const intervalId = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        setMatchStatus(`Matching... (${formattedTime})`);
      }, 1000);

      // Store the timer ID on the socket object
      customSocket.timerId = intervalId;

      setTimerInterval(intervalId);
    }
  };

  const stopTimer = () => {
    if (timerInterval !== null) {
      console.log('stop timer');
      clearInterval(timerInterval);
      setTimerInterval(null);
      setMatchStatus('');

      // Clear the timer stored on the socket object
      if (customSocket.timerId) {
        clearInterval(customSocket.timerId);
        customSocket.timerId = null;
      }
    }
  };

  const handleMatchClick = () => {
    if (isMatching) {
      stopTimer();
      setMatchStatus('Matching canceled.');
      socket.emit('cancel match'); // Emit a cancel signal to the server
    } else {
      startTimer();
      setMatchStatus('Matching...');
      console.log("matching with", selectedDifficulty, selectedTopic, selectedLanguage)
      socket.emit('match me', selectedDifficulty, selectedTopic, selectedLanguage);

      // Automatically cancel the match after 20 seconds
      setTimeout(() => {
        stopTimer();
        setMatchStatus('No matches available. Try again later.');
        socket.emit('cancel match'); // Emit a cancel signal to the server
        setIsMatching(false);
      }, 30000); // 30 seconds
    }
    setIsMatching(!isMatching);
  };

  const handleDifficultyClick = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  // Topic button click handler
  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedLanguage(value);
  }



  const difficultyLevels = [
    { label: 'Easy', className: 'difficulty-easy' },
    { label: 'Medium', className: 'difficulty-medium' },
    { label: 'Hard', className: 'difficulty-hard' },
  ];

  return (
    <div className="container mt-5" >
      <div className="row">
        {/* Left section */}
        <div className="col-md-8">
          {/* Topic divider */}
          <div className="form-group">
            <label htmlFor="topics">Choose a topic:</label>
            <div className="col-md-12 ">
              <div className="scrollable-container">
                {/* Create a wrapper div for each row of buttons */}
                {iconCategories.map((topic, index) => (
                  <div key={topic.label} className={`mb-2`}>
                    <button
                      className={`btn topic-button ${selectedTopic === topic.label ? 'active' : ''} btn-sm` }
                      onClick={() => handleTopicClick(topic.label)}
                      disabled={isMatching}
                    >
                     <img
                        src={selectedTopic === topic.label ? topic.activeIconFilePath : topic.iconFilePath}
                        alt={topic.label}
                        style={{ width: '100%', height: 'auto', maxWidth: '100%', maxHeight: '60px' }}
                      />
                    

                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ marginTop: '10px', textAlign: 'center' }}>{topic.label}</span>
                    </div>
                  </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {/* End of left section */}

        {/* Right section */}
        <div className="col-md-4 ">
          {/* Difficulty buttons divider */}
          <div className="row-md-6 ">
            <div className="form-group">
              <label>Choose your difficulty level:</label>
              <div className="col-md-12 d-flex align-items-center justify-content-center">
                <div className="difficulty-buttons">
                  {difficultyLevels.map((level) => (
                    <div key={level.label} className="mb-2">
                      <button
                        className={`btn ${level.className} ${selectedDifficulty === level.label ? 'active' : ''}`}
                        onClick={() => handleDifficultyClick(level.label)}
                        disabled={isMatching}
                      >
                        {level.label}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progamming language dropdown field divider */}
          <div className="row-md-12 ">
              <div className="form-group">
                  <div className="col-md-12"> 
                      <div className="form-group">
                        <label htmlFor="language">Preferred Language:</label>
                        <select
                          id="language"
                          className="form-control"
                          value={selectedLanguage}
                          onChange={handleLanguageChange}
                          disabled={isMatching}
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
                    </div>
                </div>
            </div>
          </div>
        </div>
        {/* End of right section */}


      {/* Bottom section */}
      <div className="row mt-3">
        {/* Match button divider */}
        <div className="col-md-12 text-right">
          <button
            id="matchButton"
            className="btn custom-match-button"
            onClick={handleMatchClick}
            disabled={isMatchFound}
          >
            {isMatching ? 'Cancel Match' : 'Match'}
          </button>
          <div className="d-flex align-items-center justify-content-end">
            <div
              id="spinner"
              className={`spinner-border spinner-border-sm text-primary ml-2 ${isMatching ? '' : 'd-none'}`}
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <div id="matchStatus" className="text-right">{matchStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;
