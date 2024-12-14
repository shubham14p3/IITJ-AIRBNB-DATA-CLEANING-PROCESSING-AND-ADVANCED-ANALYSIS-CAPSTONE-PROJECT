import React, { useState, useEffect } from "react";
import {
  Pagination,
  Tabs,
  Tab,
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
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { BASE_URL } from "./Constant";
import ClipLoader from "react-spinners/ClipLoader";

function DataAnalysis() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if data exists in localStorage
    const storedData = localStorage.getItem("dataAnalysis");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      const keys = Object.keys(parsedData);
      setTabs(keys);
      setActiveTab(keys[0]);
      setLoading(false);
    } else {
      // Fetch data from API if not in localStorage
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${BASE_URL}/api/data`);
          if (!response.ok) throw new Error("Network response was not ok");
          const result = await response.json();
          setData(result);
          localStorage.setItem("dataAnalysis", JSON.stringify(result)); // Save data to localStorage
          const keys = Object.keys(result);
          setTabs(keys);
          setActiveTab(keys[0]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const getCurrentData = () => {
    if (!data || !data[activeTab]) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data[activeTab].slice(startIndex, startIndex + itemsPerPage);
  };

  const renderTableHeaders = () => {
    if (!data || !data[activeTab] || data[activeTab].length === 0) return null;
    return (
      <TableRow>
        {Object.keys(data[activeTab][0]).map((header, index) => (
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
          <TableCell key={colIndex} sx={{ wordBreak: "break-word", whiteSpace: "normal" }}>
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

  const totalPages = data ? Math.ceil(data[activeTab]?.length / itemsPerPage) : 1;

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
          width: "100%",
        }}
      ><Typography variant="h6" align="center" sx={{ fontWeight: "bold", color: "#333", marginBottom: 3 }}>
          Clean Data after EDA
        </Typography>
        <Container
          sx={{
            width: "100%",
            height: "100%",
            paddingY: 4,
          }}
        >
          {tabs.length > 0 && (
            <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="data tabs"
                centered
                textColor="primary"
                indicatorColor="primary"
              >
                {tabs.map((tab) => (
                  <Tab key={tab} label={tab} value={tab} />
                ))}
              </Tabs>
            </Box>
          )}

          <Card
            sx={{
              backgroundColor: "#fff",
              boxShadow: 4,
              borderRadius: 4,
              padding: 3,
              marginBottom: 3,
            }}
          >
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/merged-data")}
              >
                Show Merged Data
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
              ) : data && data[activeTab] ? (
                <Table>
                  <TableHead>{renderTableHeaders()}</TableHead>
                  <TableBody>{renderTableRows()}</TableBody>
                </Table>
              ) : (
                <Typography align="center">No data available.</Typography>
              )}
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          </Card>
        </Container>
        <Box marginTop={4} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={() => navigate("/")}>
            Back
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/merged-data")}>
            Next
          </Button>
        </Box>
        <br />
      </Box>

    </Layout>
  );
}

export default DataAnalysis;
