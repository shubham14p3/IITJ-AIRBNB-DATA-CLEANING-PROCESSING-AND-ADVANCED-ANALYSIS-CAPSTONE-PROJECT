import React, { useState, useEffect } from "react";
import {
  Pagination,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Button,
  Typography,
} from "@mui/material";
import { BASE_URL } from "./Constant";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function MergedData() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/fetch-from-rds`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();

        if (result.status && result.data) {
          setData(result.data);
        } else {
          console.error("No data available:", result.message);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (event, newPage) => setCurrentPage(newPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderTableHeaders = () => {
    if (!data.length) return null;
    return (
      <TableRow>
        {Object.keys(data[0]).map((header, index) => (
          <TableCell
            key={index}
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196f3, #21cbf3)",
              color: "#fff",
              position: "sticky",
              top: 0,
              textAlign: "center",
              padding: "10px",
            }}
          >
            {header.replace(/_/g, " ")}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderTableRows = () => {
    const currentData = getCurrentData();
    return currentData.map((item, rowIndex) => (
      <TableRow key={rowIndex}>
        {Object.values(item).map((value, colIndex) => (
          <TableCell
            key={colIndex}
            sx={{
              textAlign: "center",
              padding: "10px",
              border: "1px solid rgba(224, 224, 224, 1)",
              wordBreak: "break-word",
            }}
          >
            {value === null || value === undefined
              ? "-"
              : typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : value}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <Layout>
      <Box
        sx={{
          paddingY: 4,
          paddingX: 2,
          width: "95%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", color: "#333", marginBottom: 3 }}
        >
          Merged Data Records
        </Typography>

        <Card
          sx={{
            backgroundColor: "#fff",
            boxShadow: 4,
            borderRadius: 4,
            padding: 3,
            width: "100%",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <FormControl variant="outlined" size="small">
              <InputLabel id="rows-per-page-select-label">
                Rows per page
              </InputLabel>
              <Select
                labelId="rows-per-page-select-label"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Rows per page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              maxHeight: "600px",
              overflowY: "auto",
              overflowX: "auto",
              display: "flex",
              width: "100%",
            }}
          >
            {loading ? (
              <ClipLoader color="#4A90E2" size={50} />
            ) : data.length ? (
              <Table sx={{ minWidth: "100%" }}>
                <TableHead>{renderTableHeaders()}</TableHead>
                <TableBody>{renderTableRows()}</TableBody>
              </Table>
            ) : (
              <Typography align="center">No data available.</Typography>
            )}
          </Box>

          <Box marginTop={2} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </Card>

        <Box marginTop={4} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/data-analysis")}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/final-insights")}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

export default MergedData;
