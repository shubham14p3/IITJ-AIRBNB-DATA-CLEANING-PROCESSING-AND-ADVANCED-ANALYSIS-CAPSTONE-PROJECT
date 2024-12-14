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
  TextField,
} from "@mui/material";
import { BASE_URL } from "./Constant";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function MergedData() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const initializeData = async () => {
    setLoading(true);
    try {
      const localData = localStorage.getItem("mergedData");
      if (localData) {
        const parsedData = JSON.parse(localData);
        setData(parsedData); // Set data from localStorage
        setFilteredData(parsedData);
        setLoading(false);
      }

      // Fetch full data from the server
      const response = await fetch(`${BASE_URL}/api/fetch-from-rds`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();

      if (result.status && result.data) {
        setData(result.data); // Keep full data for rendering
        setFilteredData(result.data);

        // Save a truncated version in localStorage
        let truncatedData = [];
        let dataSize = 0;

        for (const row of result.data) {
          const rowString = JSON.stringify(row);
          const rowSize = new Blob([rowString]).size;

          if (dataSize + rowSize > 4.8 * 1024 * 1024) break; // Stop if size exceeds 4.8 MB
          truncatedData.push(row);
          dataSize += rowSize;
        }

        localStorage.setItem("mergedData", JSON.stringify(truncatedData));
        console.log(
          `Saved ${truncatedData.length} rows (under 4.8 MB) to localStorage.`
        );
      } else {
        console.error("No data available:", result.message);
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const reloadData = () => {
    localStorage.removeItem("mergedData"); // Clear localStorage
    setData([]); // Clear state
    setFilteredData([]);
    setCurrentPage(1);
    initializeData(); // Re-fetch data
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);

    // Filter data based on the search text
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowercasedValue)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page after search
  };

  const handlePageChange = (event, newPage) => setCurrentPage(newPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderTableHeaders = () => {
    if (!filteredData.length) return null;
    return (
      <TableRow>
        {Object.keys(filteredData[0]).map((header, index) => (
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
            {header.replace(/_/g, " ").toUpperCase()}
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

        {/* Search Bar */}
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />

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
            <Button
              variant="outlined"
              color="secondary"
              onClick={reloadData}
            >
              Reload Data
            </Button>
          </Box>

          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "scroll",
              overflowX: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px", // Ensure the loader is vertically centered
            }}
          >
            {loading ? (
              <ClipLoader color="#4A90E2" size={50} />
            ) : filteredData.length ? (
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
            onClick={() => navigate("/fetch-unique-value")}
          >
            Next
          </Button>
        </Box>
      </Box>
      <br />
      <br />
    </Layout>
  );
}

export default MergedData;
