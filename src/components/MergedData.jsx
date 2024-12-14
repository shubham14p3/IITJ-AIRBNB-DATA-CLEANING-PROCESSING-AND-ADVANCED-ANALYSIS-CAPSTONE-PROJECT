import React, { useState, useEffect } from "react";
import {
  Pagination,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Button,
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
    // Check if data exists in localStorage
    const storedData = localStorage.getItem("mergedData");
    if (storedData) {
      setData(JSON.parse(storedData)); // Load data from localStorage
      setLoading(false);
    } else {
      // Fetch data if not in localStorage
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${BASE_URL}/api/merged_data`);
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setData(result);
          localStorage.setItem("mergedData", JSON.stringify(result)); // Save data to localStorage
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
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
              background: "linear-gradient(45deg, #2196f3, #21cbf3)", // Gradient background
              color: "#fff", // White text for contrast
              position: "sticky",
              top: 0,
              zIndex: 1,
              padding: "10px 15px", // Add spacing for better readability
              textAlign: "center", // Center align the header text
              borderBottom: "2px solid #ddd", // Add a subtle border at the bottom
              textTransform: "capitalize", // Capitalize header text
              "&:hover": {
                background: "linear-gradient(45deg, #21cbf3, #2196f3)", // Reverse gradient on hover
              },
            }}
          >
            {header}
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
              wordBreak: "break-word",
              whiteSpace: "normal",
              border: "1px solid rgba(224, 224, 224, 1)", // Light gray border
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
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold", color: "#333", marginBottom: 3 }}>
          Data Analysis: Enhanced Insights
        </Typography>

        <Card sx={{ backgroundColor: "#fff", boxShadow: 4, borderRadius: 4, padding: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
            <FormControl variant="outlined" size="small">
              <InputLabel id="rows-per-page-select-label">Rows per page</InputLabel>
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

          <Box sx={{
            maxHeight: "400px", overflowY: "auto", overflowX: "auto", display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}>
            {loading ? (
              <ClipLoader color="#4A90E2" size={50} />
            ) : data.length ? (
              <Table>
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
          <Button variant="contained" color="primary" onClick={() => navigate("/data-analysis")}>
            Back
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/final-insights")}>
            Next
          </Button>
        </Box>
      </Container>

    </Layout>
  );
}

export default MergedData;
