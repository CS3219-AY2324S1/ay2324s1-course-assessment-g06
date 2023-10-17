import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from '@mui/material';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Analytics: React.FC = () => {
  const value = 0.66;
  const maxValue = 1;

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
              <img
                style={{ width: 40, marginTop: -5 }}
                src="https://i.imgur.com/b9NyUGm.png"
                alt="doge"
              />
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
              <Typography variant="h6" align="center">
                Another Box
              </Typography>
              {/* You can add additional content or components here */}
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
