import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";
import axios from "axios";

const USER_HOST = process.env.USER_HOST || "http://localhost:3003/api/auth";
const USER_HISTORY =
  process.env.USER_HISTORY || "http://localhost:3003/api/user";
const QUESTION_HOST =
  process.env.QUESTION_HOST || "http://localhost:3000/api/questions";

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

type HeatMapValue = {
  date: string;
  content?: string | string[] | React.ReactNode;
  count: number;
};

type questionData = {};
const Analytics: React.FC = () => {
  // dummy values
  const heatvalue = [
    { date: "2022-01-11T16:00:00.000Z", count: 2 },
    { date: "2022-01-12T16:00:00.000Z", count: 20 },
    { date: "2022-01-13T16:00:00.000Z", count: 10 },
    ...[...Array(17)].map((_, idx) => ({
      date: `2022/02/${idx + 10}T16:00:00.000Z`,
      count: idx,
      content: "",
    })),
    { date: "2022/04/11T16:00:00.000Z", count: 2 },
    { date: "2022/05/01T16:00:00.000Z", count: 5 },
    { date: "2022/05/02T16:00:00.000Z", count: 5 },
    { date: "2022/05/04T16:00:00.000Z", count: 11 },
  ];
  // all unique values
  const [heatData, setHeatData] = useState<Array<HeatMapValue>>(heatvalue);

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

  // 4 API calls
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.id || 1;

    // get all user details
    axios
      .get(USER_HISTORY + "/history/" + userId)
      .then((res) => {
        // Assuming res.data is an array of solved questions
        const solvedQuestions = res.data;

        // Calculate the count for each difficulty level
        const easyCount = solvedQuestions.filter(
          (q: any) => q.difficulty === "Easy"
        ).length;
        const mediumCount = solvedQuestions.filter(
          (q: any) => q.difficulty === "Medium"
        ).length;
        const hardCount = solvedQuestions.filter(
          (q: any) => q.difficulty === "Hard"
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

    axios
      .get(QUESTION_HOST + "/total")
      .then((response) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(USER_HISTORY + "/attempts/" + userId)
      .then((response) => {
        console.log(response.data);
        setHeatData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="container">
      <Card
        sx={{
          display: "flex",
          borderRadius: "15px",
          backgroundColor: "#E6E6E6",
          boxShadow: "none",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <header
              style={{
                fontFamily: "Cascadia Code, Inter, sans-serif",
                letterSpacing: "1px",
                fontSize: "120%",
                fontWeight: "bold",
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              Solved Problems
            </header>
          </CardContent>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent style={{ marginTop: "15%" }}>
            <CircularProgressbarWithChildren
              // number of questions user completed
              value={userDetails.Total}
              // number of questions in our db
              maxValue={questionDetails.Total}
              text={`${userDetails.Total}`}
              strokeWidth={3}
              background
              styles={buildStyles({
                trailColor: "transparent",
                pathColor: "purple",
                textColor: "black",
                backgroundColor: "white",
                textSize: "15px",
              })}
            >
              {/* <h6>{userDetails.Total}</h6> */}
              <p style={{ paddingTop: "30%" }}>solved</p>
            </CircularProgressbarWithChildren>
          </CardContent>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
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
        <Card
          sx={{
            display: "flex",
            backgroundColor: "#E6E6E6",
            borderRadius: "15px",
            marginTop: "20px",
            boxShadow: "none",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent>
              <header
                style={{
                  fontFamily: "Cascadia Code, Inter, sans-serif",
                  letterSpacing: "1px",
                  fontSize: "90%",
                  paddingLeft: "20px",
                  paddingTop: "10px",
                }}
              >
                0 submissions in the last year
              </header>
            </CardContent>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent>
              <HeatMap
                value={heatData}
                width={800}
                rectSize={20}
                weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                startDate={new Date("2022/01/01")}
                // endDate={new Date('2022/12/31')}
                //legendCellSize?
                //rectProps?
                // go see props for css in the future
                panelColors={{
                  0: "#f4decd",
                  2: "#e4b293",
                  4: "#d48462",
                  10: "#c2533a",
                  20: "#ad001d",
                  30: "#000",
                }}
              />
            </CardContent>
          </Box>
        </Card>
      </Box>

      <Card sx={{ display: "flex", margin: "10" }}>
        <CardContent>History of Questions Attempted</CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
