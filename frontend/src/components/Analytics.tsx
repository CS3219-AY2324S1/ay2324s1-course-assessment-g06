import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect } from 'react';
import HeatMap from '@uiw/react-heat-map';
import axios from 'axios';

const USER_HOST = process.env.USER_HOST || 'http://localhost:3003/api/auth';
const USER_HISTORY =
  process.env.USER_HISTORY || 'http://localhost:3003/api/user';
const QUESTION_HOST =
  process.env.QUESTION_HOST || 'http://localhost:3000/api/questions';

type QuestionDetails = {
  Easy: number;
  Medium: number;
  Hard: number;
  Total: number;
};
// how many the user solved
type UserDetails = {
  Easy: number;
  Medium: number;
  Hard: number;
  Total: number;
  Questions: [];
  //need attempted
};
type questionData = {};
const Analytics: React.FC = () => {
  // all unique values
  const [heatData, setHeatData] = useState([]);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Total: 0,
    Questions: [],
  });

  const [questionDetails, setQuestionDetails] = useState<QuestionDetails>({
    Easy: 1,
    Medium: 1,
    Hard: 1,
    Total: 3,
  });

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.id || 1;

    // get all user details
    axios
      .get(USER_HISTORY + '/history/' + userId)
      .then((res) => {
        // Assuming res.data is an array of solved questions
        const solvedQuestions = res.data;

        // Calculate the count for each difficulty level
        const easyCount = solvedQuestions.filter(
          (q: any) => q.difficulty === 'Easy'
        ).length;
        const mediumCount = solvedQuestions.filter(
          (q: any) => q.difficulty === 'Medium'
        ).length;
        const hardCount = solvedQuestions.filter(
          (q: any) => q.difficulty === 'Hard'
        ).length;
        // console.log(res.data);
        setUserDetails({
          ...userDetails,
          Easy: easyCount,
          Medium: mediumCount,
          Hard: hardCount,
          Total: solvedQuestions.length,
          Questions: solvedQuestions,
        });
      })
      .catch((err) => console.log(err));
    axios.get(QUESTION_HOST + '/total').then((response) => {
      // console.log(response.data);
      const data = response.data; // Assuming your data is an array of objects
      let total = 0;
      data.forEach((item: any) => {
        total += item.count;
        setQuestionDetails((prevQuestionDetails) => ({
          ...prevQuestionDetails,
          [item.difficulty]: item.count,
        }));
      });
      console.log(total);
      // Update the Total count
      setQuestionDetails((prevQuestionDetails) => ({
        ...prevQuestionDetails,
        Total: total || 1,
      }));
    });
  }, []);
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
            <CircularProgressbarWithChildren
              value={userDetails.Total}
              maxValue={questionDetails.Total}
            >
              <h6>{userDetails.Total}</h6>
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
              <LinearProgress
                variant="determinate"
                value={100 * (userDetails.Easy / (questionDetails.Easy || 1))}
              />
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                Medium
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  100 * (userDetails.Medium / (questionDetails.Medium || 1))
                }
              />
            </Box>
            <Box>
              <Typography variant="h6" align="center">
                Hard
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100 * (userDetails.Hard / (questionDetails.Hard || 1))}
              />
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
