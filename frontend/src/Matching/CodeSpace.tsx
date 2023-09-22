// CodeSpace.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client'; // Import Socket type from 'socket.io-client'

const CodeSpace = () => {
  const { roomId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null); // Define the type of socket

  useEffect(() => {
    const matchedSocket = io('http://localhost:3000', {
      query: { roomId }, // Pass the roomId as a query parameter
    });

    matchedSocket.on('connect', () => {
      console.log('Connected to matched socket');
    });

    setSocket(matchedSocket);

    return () => {
      matchedSocket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [roomId]);

 

  return (
    <div>
      <h2>Welcome, {socket ? socket.id : 'Loading...'}</h2>
      <p>
        You are matched with another user using difficulty: {"" || 'Not selected'}
      </p>
    </div>
  );
};

export default CodeSpace;
