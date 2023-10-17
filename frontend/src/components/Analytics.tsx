import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState,useEffect } from 'react';
import HeatMap from '@uiw/react-heat-map';
import axios from 'axios';

const USER_HOST = process.env.USER_HOST || 'http://localhost:3003/api/auth';
const USER_HISTORY = process.env.USER_HISTORY || 'http://localhost:3003/api/user';
const QUESTION_HOST = process.env.QUESTION_HOST || 'http://localhost:3000/api/questions';

const Analytics: React.FC = () => {
 
  const [solvedValue, setSolvedValue] = useState(10);
  const value = 0.66;
  const maxValue = 1;
  const heatvalue = [
    { date: '2016/01/11', count: 2 },
    { date: '2016/01/12', count: 20 },
    { date: '2016/01/13', count: 10 },
    ...[...Array(17)].map((_, idx) => ({
      date: `2016/02/${idx + 10}`,
      count: idx,
      content: '',
    })),
    { date: '2016/04/11', count: 2 },
    { date: '2016/05/01', count: 5 },
    { date: '2016/05/02', count: 5 },
    { date: '2016/05/04', count: 11 },
  ];
  // const [heatValue,setHeatValue] = useState(heatvalue);

  useEffect(()=> {
    axios.get()
  });
  return (
    <div className="container">
      <Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <h1
              style={{
                fontFamily: 'Cascadia Code, Inter, sans-serif',
                letterSpacing: '1px',
                fontSize: '2rem',
              }}
            >
              Solved Problems
            </h1>
          </CardContent>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <CircularProgressbarWithChildren value={value} maxValue={maxValue}>
              
              <h6>{solvedValue}</h6>
              <h6>solved</h6>
            </CircularProgressbarWithChildren>
          </CardContent>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Box>
              <Typography variant="h6" align="center">
                Easy
              </Typography>
              <LinearProgress variant="determinate" value={10} />
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                Medium
              </Typography>
              <LinearProgress variant="determinate" value={10} />
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                Hard
              </Typography>
              <LinearProgress variant="determinate" value={10} />
            </Box>
          </CardContent>
        </Box>
      </Card>
      <Box sx={{ marginBottom: 3 }}>
        <Card sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <CardContent>
              <HeatMap
                value={heatvalue}
                weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                startDate={new Date('2016/01/01')}
                panelColors={{
                  0: '#f4decd',
                  2: '#e4b293',
                  4: '#d48462',
                  10: '#c2533a',
                  20: '#ad001d',
                  30: '#000',
                }}
              />
            </CardContent>
          </Box>
        </Card>
      </Box>

      <Card sx={{ display: 'flex', margin: '10' }}>
        <CardContent>History of Questions Attempted</CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
