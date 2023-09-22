import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { Socket } from 'socket.io-client';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer | null>(null);

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

    function matchFound(msg: string) {
      setIsMatching(false);
      setMatchStatus(msg);
      
      // Clear the timer stored on the socket object
      if (customSocket.timerId) {
        clearInterval(customSocket.timerId);
        customSocket.timerId = null;
      }
    }

    // Handle match canceled event
    function matchCanceled() {
      setIsMatching(false);
      setMatchStatus('Matching canceled.');
      
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
  }, []);

  const startTimer = () => {
    if (timerInterval === null) {
      console.log("start timer");
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
      console.log("stop timer");
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
      setMatchStatus("Matching canceled.");
      socket.emit('cancel match'); // Emit a cancel signal to the server
    } else {
      startTimer();
      setMatchStatus('Matching...');
      console.log(selectedDifficulty);
      socket.emit('match me', selectedDifficulty);
    }
    setIsMatching(!isMatching);
  };

  const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedDifficulty(value);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="difficulty">Select difficulty:</label>
            <select
              id="difficulty"
              className="form-control"
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              disabled={isMatching}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-4">
          <button id="matchButton" className="btn btn-primary" onClick={handleMatchClick} >
            {isMatching ? 'Cancel Match' : 'Match'}
          </button>
          <div className="d-flex align-items-center mt-2">
            <div id="spinner" className={`spinner-border spinner-border-sm text-primary mr-2 ${isMatching ? '' : 'd-none'}`} role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div id="matchStatus">{matchStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;
