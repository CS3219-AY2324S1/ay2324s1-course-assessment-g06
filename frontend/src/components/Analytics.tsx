import { Box, Card, CardContent, LinearProgress } from "@mui/material";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchUserHistory,
  fetchAttemptedQuestions,
  fetchQuestionsDetails,
  fetchUserAttemptsDates,
} from "../services/analytics.service";

type QuestionDetails = {
  Easy: number;
  Medium: number;
  Hard: number;
  Total: number;
};

type UserDetails = {
  Easy: number;
  Medium: number;
  Hard: number;
  Total: number;
  Questions: [];
};

type HeatMapValue = {
  date: string;
  content?: string | string[] | React.ReactNode;
  count: number;
};

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [heatData, setHeatData] = useState<Array<HeatMapValue>>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    Total: 0,
  });
  const [allQuestionIds, setAllQuestionIds] = useState<string[]>([]);
  const [allQuestionTitles, setAllQuestionTitles] = useState<
    { question_id: string; title: string; difficulty: string }[]
  >([]);

  // Fetch user's history
  useEffect(() => {
    fetchUserHistory()
      .then((res) => {
        const solvedQuestions = res.data;

        const easyCount = solvedQuestions.filter(
          (q: any) => q.difficulty === "Easy"
        ).length;
        const mediumCount = solvedQuestions.filter(
          (q: any) => q.difficulty === "Medium"
        ).length;
        const hardCount = solvedQuestions.filter(
          (q: any) => q.difficulty === "Hard"
        ).length;

        setUserDetails({
          ...userDetails,
          Easy: easyCount,
          Medium: mediumCount,
          Hard: hardCount,
          Total: solvedQuestions.length,
          Questions: solvedQuestions,
        });

        const questionIds = solvedQuestions.map(
          (item: any) => item.question_id
        );
        setAllQuestionIds(questionIds);
      })
      .catch((err) => console.log(err));
  }, []);

  // Fetch user attempted questions id, title and difficulty
  useEffect(() => {
    if (allQuestionIds.length > 0) {
      fetchAttemptedQuestions(allQuestionIds)
        .then((response) => {
          const data = response.data;
          const idAndTitleAndDifficulty = data.map((item: any) => ({
            question_id: item._id,
            title: item.title,
            difficulty: item.difficulty,
          }));

          setAllQuestionTitles(idAndTitleAndDifficulty);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [allQuestionIds]);

  // Fetch total number of questions in the database and total number of questions per category
  useEffect(() => {
    fetchQuestionsDetails()
      .then((response) => {
        const data = response.data;
        let total = 0;
        data.forEach((item: any) => {
          total += item.count;
          setQuestionDetails((prevQuestionDetails) => ({
            ...prevQuestionDetails,
            [item.difficulty]: item.count,
          }));
        });

        setQuestionDetails((prevQuestionDetails) => ({
          ...prevQuestionDetails,
          Total: total || 1,
        }));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // Data fetch completed, set loading to false
        setIsLoading(false);
      });
  }, []);

  // Fetch user attempts dates
  useEffect(() => {
    fetchUserAttemptsDates()
      .then((response) => {
        setHeatData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#E6E6E6",
              borderRadius: "15px",
              boxShadow: "none",
              paddingBottom: "2%",
            }}
          >
            <CardContent>
              <header
                style={{
                  letterSpacing: "1px",
                  fontSize: "110%",
                  fontWeight: "bold",
                  paddingLeft: "3%",
                  paddingTop: "2%",
                }}
              >
                Solved Problems
              </header>
            </CardContent>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "80%",
                marginLeft: "15%",
              }}
            >
              <CardContent>
                <div style={{ width: "90%", height: "90%" }}>
                  <CircularProgressbarWithChildren
                    value={userDetails.Total}
                    maxValue={questionDetails.Total}
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
              <CardContent style={{ width: "100%", paddingTop: "3%" }}>
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
                    value={
                      100 * (userDetails.Easy / (questionDetails.Easy || 1))
                    }
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
                    value={
                      100 * (userDetails.Hard / (questionDetails.Hard || 1))
                    }
                  />
                </div>
              </CardContent>
            </Box>
          </Box>
          <Box>
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  paddingLeft: "3%",
                  paddingRight: "3%",
                  paddingTop: "2%",
                }}
              >
                <CardContent>
                  <header
                    style={{
                      letterSpacing: "1px",
                      fontSize: "100%",
                    }}
                  >
                    <strong>{userDetails.Total}</strong> submissions in the last
                    year
                  </header>
                </CardContent>
                <CardContent
                  style={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <HeatMap
                    value={heatData}
                    width="100%"
                    rectSize={13}
                    weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
                    startDate={new Date("2023/01/01")}
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
              paddingLeft: "3%",
              paddingRight: "3%",
              paddingTop: "2%",
            }}
          >
            <CardContent style={{ width: "100%" }}>
              <header
                style={{
                  letterSpacing: "1px",
                  fontSize: "100%",
                  paddingBottom: "3%",
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
                    borderRadius: "20px",
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "15px",
                    padding: "7px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/home/${item.question_id}`)}
                >
                  <span style={{ fontWeight: "bold", paddingLeft: "1%" }}>
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      borderRadius: "50px",
                      padding: "5px 15px",
                      marginRight: "15px",
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
        </>
      )}
    </div>
  );
};

export default Analytics;
