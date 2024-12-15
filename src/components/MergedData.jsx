import React, { useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { fetchMergedData, loadDataToRDS } from "../slice/mergedDataSlice";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

function MergedData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { data, loading, error } = useSelector((state) => state.mergedData);
  const [filteredData, setFilteredData] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  // Fetch data only if not already in store
  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchMergedData());
    } else {
      setFilteredData(data);
    }
  }, [data, dispatch]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);

    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowercasedValue)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
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

  const handleLoadDataToRDS = () => {
    dispatch(loadDataToRDS()).then(() => {
      alert("Data successfully uploaded to RDS!");
    });
  };

  const handleLoadDataFromRDS = () => {
    dispatch(fetchMergedData());
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
              background: "linear-gradient(90deg, #ff5722, #ff9800)", // Gradient background
              color: "#fff", // White text for contrast
              position: "sticky",
              top: 0,
              zIndex: 2, // Ensure it remains above scrolling rows
              padding: "12px 16px", // Spacing for better readability
              textAlign: "center", // Center-align header text
              borderBottom: "2px solid #f0f0f0", // Add a subtle bottom border
              textTransform: "uppercase", // Uppercase for uniform appearance
              letterSpacing: "0.5px", // Slight spacing between letters
              "&:hover": {
                background: "linear-gradient(90deg, #ff9800, #ff5722)", // Reverse gradient on hover
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)", // Add shadow on hover
              },
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
          <TableCell key={colIndex} sx={{ textAlign: "center" }}>
            {value || "-"}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Layout>
      <Box sx={{ paddingY: 4, paddingX: 2, width: "95%", margin: "0 auto" }}>
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold", marginBottom: 3 }}>
          Merged Data Records
        </Typography>

        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />

        <Card sx={{ padding: 3, boxShadow: 4, borderRadius: 4 }}>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
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
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadDataFromRDS}
                sx={{ marginRight: 1 }}
              >
                Load Data from RDS
              </Button>
              <Button variant="contained" color="secondary" onClick={handleLoadDataToRDS}>
                Load Data to RDS
              </Button>
            </Box>
          </Box>

          <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                <ClipLoader color="#4A90E2" size={50} />
              </Box>
            ) : error ? (
              <Typography color="error" align="center">
                {error}
              </Typography>
            ) : filteredData.length ? (
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
