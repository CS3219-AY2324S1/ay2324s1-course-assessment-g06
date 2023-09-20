import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const AddButton = styled(Button)`
  background-color: #90bfff; /* Change the background color */
  color: white; /* Change the text color */
  border-radius: 5px; /* Add rounded corners */
  font-size: 16px; /* Adjust the font size */
  font-weight: bold;
  &:hover {
    background-color: #7ab2fe; /* Change the background color on hover */
  }
`;

interface Question {
  _id: string;
  title: String;
  frontendQuestionId: String;
  difficulty: String;
  content: String;
  category: String;
  topics: String;
}

export default function BasicTable() {
  const [data, setData] = useState<Question[]>([]);

  const fetchData = () => {
    fetch("http://localhost:3000/api/questions")
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      {/* Place the "Add" button here */}
      <AddButton
        variant="contained"
        style={{ marginBottom: "20px", marginLeft: "1225px" }}
      >
        Add
      </AddButton>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <TableContainer component={Paper} sx={{ width: "80%" }}>
          <Table sx={{ minWidth: 550 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Complexity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: index % 2 === 0 ? "#E6E6E6" : "#D8D8D8",
                  }}
                  className="table-row"
                  onClick={() => navigate(`/questions/${row._id}`)}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.category}</TableCell>
                  <TableCell align="right">{row.difficulty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
