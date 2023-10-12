import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Container,
  Button,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import "./Table.css";
import CircularProgress from "@mui/material/CircularProgress";


const AddButton = styled(Button)`
  background-color: #d8d8d8;
  color: white;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  &:hover {
    background-color: #a2a2a2;
  }
`;

interface Question {
  _id: string;
  title: string;
  frontendQuestionId: string;
  difficulty: string;
  content: string;
  category: string;
  topics: string;
}

const BasicTable: React.FC = () => {
  const [data, setData] = useState<Question[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFirstPageData = () => {
    fetch(`http://localhost:3000/api/questions/pagination/first`)
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  };

  const fetchRemainingData = () => {
    fetch(`http://localhost:3000/api/questions/pagination/remaining`)
      .then((response) => response.json())
      .then((responseData) => {
        setData((prevData) => [...prevData, ...responseData]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFirstPageData();
        await fetchRemainingData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleAddButtonClick = () => {
    navigate("/questions/add-question");
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress color="inherit" />
      </div>
    );
  }

  return (
    <Container maxWidth="lg" style={{ margin: "0 auto" }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", fontSize: "18px", width: "35%" }}>
                Question
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>

              <TableCell
                style={{ fontWeight: "bold", fontSize: "18px", width: "38%" }}
                align="center"
              >
                Complexity
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>

              <TableCell
                style={{ fontWeight: "bold", fontSize: "18px", width: "45%" }}
                align="right"
              >
                Topics
              </TableCell>

            </TableRow>
          </TableHead>
          <TableContainer component={Paper} sx={{ width: "100%", borderRadius: "15px" }}>
            <Table sx={{ minWidth: 550 }} aria-label="simple table">
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor:
                          index % 2 === 0 ? "#E6E6E6" : "#D8D8D8",
                      }}
                      className="table-row"
                      onClick={() => navigate(`/questions/${row._id}`)}
                    >
                      <TableCell component="th" scope="row" style={{ width: "46%" }}>
                        {row.title}
                      </TableCell>
                      <TableCell align="center" style={{ width: "15%" }}>{row.difficulty}</TableCell>
                      <TableCell align="right" style={{ width: "45%" }}>{row.topics}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            rowsPerPage={rowsPerPage}
            page={page}
            count={data.length}
            component="div"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
        <Grid item xs={12}>
        <AddButton
          sx={{
            position: 'fixed',
            bottom: '40px', // Adjust the distance from the bottom as needed
            right: '40px',  // Adjust the distance from the right as needed
            height: '50px',
            fontSize: '34px',
            borderRadius: '50px',
          }}
          variant="contained"
          onClick={handleAddButtonClick}
        >
          +
        </AddButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BasicTable;
