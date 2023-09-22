import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Container} from '@mui/material';
import "./Table.css";
import { useNavigate } from "react-router-dom";
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

  const handleAddButtonClick = () => {
    navigate("/questions/add-question");
  };

  return (
    <Container maxWidth="lg" style={{ margin: "0 auto" }}> 
    <Grid sx={{ flexGrow: 1 }} container spacing={1}>
      {/* Place the "Add" button here */}
      <Grid item xs={12}>
        <AddButton
          variant="contained"
          onClick={handleAddButtonClick}
        >
          Add
        </AddButton>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
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
      </Grid>
    </Grid>
    </Container>
  );
}
