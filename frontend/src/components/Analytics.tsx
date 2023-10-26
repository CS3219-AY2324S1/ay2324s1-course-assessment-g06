import { Box, Card, CardContent, LinearProgress } from "@mui/material";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";
import axios from "axios";
import authHeader from "../services/auth-header";
import { useNavigate } from "react-router-dom";
import Tooltip from "@uiw/react-tooltip";

const USER_HOST =
  process.env.REACT_APP_USR_SVC_AUTH || "http://localhost:3003/api/auth";
const USER_HISTORY =
  process.env.REACT_APP_USR_SVC_HIST || "http://localhost:3003/api/user";
const QUESTION_HOST =
  process.env.REACT_APP_QNS_SVC || "http://localhost:3000/api/questions";

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
  // all unique values
  const [heatData, setHeatData] = useState<Array<HeatMapValue>>([]);

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

  const [allQuestionIds, setAllQuestionIds] = useState<string[]>([]);
  const [allQuestionTitles, setAllQuestionTitles] = useState<
    { question_id: string; title: string; difficulty: string }[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    // fetch user history
    axios
      .get(USER_HISTORY + "/get", { headers: authHeader() })
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

        // update user details state
        setUserDetails({
          ...userDetails,
          Easy: easyCount,
          Medium: mediumCount,
          Hard: hardCount,
          Total: solvedQuestions.length,
          Questions: solvedQuestions,
        });

        // consolidate all question Ids in user history
        const questionIds = solvedQuestions.map(
          (item: any) => item.question_id
        );
        setAllQuestionIds(questionIds);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (allQuestionIds.length > 0) {
      const requestBody = {
        ids: allQuestionIds,
      };
      axios
        .post(QUESTION_HOST + "/questionbyid", requestBody, {
          headers: authHeader(),
        })
        .then((response) => {
          const data = response.data;
          const titleAndDifficulty = data.map((item: any) => ({
            question_id: item._id,
            title: item.title,
            difficulty: item.difficulty,
          }));
          console.log(titleAndDifficulty);

          setAllQuestionTitles(titleAndDifficulty);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [allQuestionIds]);

  useEffect(() => {
    // fetch total question data
    axios
      .get(QUESTION_HOST + "/total", { headers: authHeader() })
      .then((response) => {
        const data = response.data; // Assuming your data is an array of objects
        let total = 0;
        data.forEach((item: any) => {
          total += item.count;
          setQuestionDetails((prevQuestionDetails) => ({
            ...prevQuestionDetails,
            [item.difficulty]: item.count,
          }));
        });

        // Update the total count
        setQuestionDetails((prevQuestionDetails) => ({
          ...prevQuestionDetails,
          Total: total || 1,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // fetch user attempts data
    axios
      .get(USER_HISTORY + "/attempts", { headers: authHeader() })
      .then((response) => {
        console.log(response.data);
        // update heat data state
        setHeatData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // fetch user's attempt
  });
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
                // fontFamily: "Cascadia Code, Inter, sans-serif",
                letterSpacing: "1px",
                fontSize: "110%",
                fontWeight: "bold",
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              Solved Problems
            </header>
          </CardContent>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", width: "80%" }}>
          <CardContent style={{ marginTop: "5%" }}>
            <div style={{ width: "78%", height: "78%" }}>
              <CircularProgressbarWithChildren
                // number of questions user completed
                value={userDetails.Total}
                // number of questions in our db
                maxValue={questionDetails.Total}
                // text={`${userDetails.Total}`}
                strokeWidth={5}
                background
                styles={buildStyles({
                  trailColor: "transparent",
                  pathColor: "#6C63FF",
                  textColor: "black",
                  backgroundColor: "white",
                  textSize: "15px",
                })}
              >
                <div style={{ fontSize: "170%", fontWeight: "bold" }}>
                  {userDetails.Total}
                </div>
                <div style={{ fontSize: "90%" }}>solved</div>
              </CircularProgressbarWithChildren>
            </div>
          </CardContent>
          <CardContent style={{ width: "100%", marginTop: "5%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginTop: "2px",
                  paddingBottom: "3px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    marginTop: "2px",
                    paddingBottom: "3px",
                  }}
                >
                  Easy
                </span>
                <span>
                  <span>
                    <strong>{userDetails.Easy}</strong>
                  </span>
                  <span>/</span>
                  <span>{questionDetails.Easy}</span>
                </span>
              </div>
              <LinearProgress
                sx={{
                  backgroundColor: "#D5E8D2",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#BCDEB6",
                  },
                  height: "9px",
                  borderRadius: "20px",
                }}
                variant="determinate"
                value={100 * (userDetails.Easy / (questionDetails.Easy || 1))}
                className="MuiLinearProgress-colorPrimary"
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginTop: "2px",
                  paddingBottom: "3px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    marginTop: "2px",
                    paddingBottom: "3px",
                  }}
                >
                  Medium
                </span>
                <span>
                  <span>
                    <strong>{userDetails.Medium}</strong>
                  </span>
                  <span>/</span>
                  <span>{questionDetails.Medium}</span>
                </span>
              </div>

              <LinearProgress
                sx={{
                  backgroundColor: "#F9E7B8",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#F2CE6F",
                  },
                  height: "9px",
                  borderRadius: "20px",
                }}
                variant="determinate"
                value={
                  100 * (userDetails.Medium / (questionDetails.Medium || 1))
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginTop: "2px",
                  paddingBottom: "3px",
                }}
              >
                <span>Hard</span>
                <span>
                  <span>
                    <span>
                      <strong>{userDetails.Hard}</strong>
                    </span>
                    <span>/</span>
                    <span>{questionDetails.Hard}</span>
                  </span>
                </span>
              </div>

              <LinearProgress
                sx={{
                  backgroundColor: "#F9A2A2",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#F14949",
                  },
                  height: "9px",
                  borderRadius: "20px",
                }}
                variant="determinate"
                value={100 * (userDetails.Hard / (questionDetails.Hard || 1))}
              />
            </div>
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
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <CardContent>
              <header
                style={{
                  // fontFamily: "Cascadia Code, Inter, sans-serif",
                  letterSpacing: "1px",
                  fontSize: "100%",
                  paddingLeft: "20px",
                  paddingTop: "10px",
                }}
              >
                <strong>{userDetails.Total}</strong> submissions in the last
                year
              </header>
            </CardContent>
            {/* </Box> */}
            {/* <Box sx={{ display: "flex", flexDirection: "row" }}> */}
            <CardContent
              style={{
                display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                marginLeft: "10px",
                width: "100%",
              }}
            >
              <HeatMap
                value={heatData}
                width="100%"
                rectSize={13}
                weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                startDate={new Date("2023/01/01")}
                // rectRender={(props, data) => {
                //   return (
                //     <Tooltip
                //       key={props.key}
                //       placement="top"
                //       content={`count: ${data.count || 0}`}
                //     >
                //       <rect {...props} />
                //     </Tooltip>
                //   );
                // }}
                // endDate={new Date('2022/12/31')}
                //legendCellSize?
                //rectProps?
                // go see props for css in the future
                panelColors={{
                  0: "white", // lightest purple
                  2: "#9C96FF", // light purple
                  4: "#6C63FF", // medium purple
                  20: "#493FE9", // dark purple
                  30: "#322BA9", // darkest purple
                }}
              />
            </CardContent>
          </Box>
        </Card>
      </Box>

      <Card
        sx={{
          display: "flex",
          backgroundColor: "#E6E6E6",
          borderRadius: "15px",
          marginTop: "20px",
          boxShadow: "none",
        }}
      >
        <CardContent style={{ width: "100%" }}>
          <header
            style={{
              fontFamily: "Cascadia Code, Inter, sans-serif",
              letterSpacing: "1px",
              fontSize: "100%",
              paddingLeft: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
              fontWeight: "bold",
            }}
          >
            History of Questions Attempted
          </header>
          {allQuestionTitles.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid white",
                borderRadius: "5px",
                backgroundColor: "white",
                width: "97%",
                marginLeft: "1.5%",
                marginBottom: "15px",
                padding: "7px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/analytics/${item.question_id}`)}
            >
              <span style={{ fontWeight: "bold", paddingLeft: "1%" }}>
                {item.title}
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "3%",
                  padding: "0.7%",
                  width: "7%",
                  borderRadius: "20px",
                  backgroundColor:
                    item.difficulty === "Easy"
                      ? "#BCDEB6" // Background color for "Easy" difficulty
                      : item.difficulty === "Medium"
                      ? "#F2CE6F" // Background color for "Medium" difficulty
                      : item.difficulty === "Hard"
                      ? "#F14949" // Background color for "Hard" difficulty
                      : "transparent", // Default background color if none of the conditions match
                }}
              >
                {item.difficulty}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
