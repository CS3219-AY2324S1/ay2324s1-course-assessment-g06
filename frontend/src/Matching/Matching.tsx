import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './Matching.css';

// Import topic Button Images
import stringIcon from './icons/string_icon.png';
import algorithmIcon from './icons/algorithm_icon.png';
import dataStructureIcon from './icons/data_structure_icon.png';
import recursionIcon from './icons/recursion_icon.png';
import arrayIcon from './icons/array_icon.png';
import brainTeaserIcon from './icons/brainteaser_icon.png';

// Cast the socket to the CustomSocket type
const customSocket = socket as CustomSocket;

// Define a custom interface that extends the Socket interface
interface CustomSocket extends Socket {
  timerId?: NodeJS.Timer | null;
}

const Matchmaking: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [matchStatus, setMatchStatus] = useState<string>('');
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Easy'); // Set the default value to "Easy"
  const [selectedTopic, setSelectedTopic] = useState<string>('Strings'); // Track the selected topic
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
      console.log("matching with", selectedDifficulty, selectedTopic)
      socket.emit('match me', selectedDifficulty, selectedTopic);

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

  const difficultyLevels = [
    { label: 'Easy', className: 'difficulty-easy' },
    { label: 'Medium', className: 'difficulty-medium' },
    { label: 'Hard', className: 'difficulty-hard' },
  ];

  const categories = [
    { label: 'Strings', iconFilePath: stringIcon },
    { label: 'Algorithms', iconFilePath: algorithmIcon },
    { label: 'Data Structures', iconFilePath: dataStructureIcon },
    { label: 'Recursion', iconFilePath: recursionIcon },
    { label: 'Array', iconFilePath: arrayIcon },
  ];

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="form-group">
            <label htmlFor="topics">Choose a topic to work on with a peer:</label>
            <div className="col-md-12">
              <div className="topic-img">
                {categories.map((topic) => (
                  <div key={topic.label} className="mb-2">
                    <button
                      className={`btn topic-button ${selectedTopic === topic.label ? 'active' : ''}`}
                      onClick={() => handleTopicClick(topic.label)}
                      disabled={isMatching}
                    >
                      <img src={topic.iconFilePath} alt={topic.label} />
                    </button>
                    {topic.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label>Choose your difficulty level:</label>
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

      <div className="row mt-3">
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
