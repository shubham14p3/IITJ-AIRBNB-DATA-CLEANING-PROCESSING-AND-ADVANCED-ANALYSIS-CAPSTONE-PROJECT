import React, { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Card,
    Grid,
    InputBase,
    Button,
    Popover,
} from "@mui/material";
import { BASE_URL } from "./Constant";
import Layout from "../layout/Layout";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

function FetchUniqueValue() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedValues, setSelectedValues] = useState({});
    const [searchQueries, setSearchQueries] = useState({});
    const navigate = useNavigate();

    const fetchUniqueValues = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/fetch-unique-values`);
            if (!response.ok) throw new Error("Failed to fetch unique values");
            const result = await response.json();

            if (result.status && result.data) {
                setData(result.data);

                // Initialize state for dropdowns and search queries
                const initialSelection = Object.keys(result.data).reduce(
                    (acc, key) => ({ ...acc, [key]: "" }),
                    {}
                );
                setSelectedValues(initialSelection);

                const initialSearch = Object.keys(result.data).reduce(
                    (acc, key) => ({ ...acc, [key]: "" }),
                    {}
                );
                setSearchQueries(initialSearch);
            } else {
                console.error("No data available:", result.message);
                setData({});
            }
        } catch (error) {
            console.error("Error fetching unique values:", error);
            setData({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniqueValues();
    }, []);

    const handleSelectChange = (key) => (event) => {
        setSelectedValues((prev) => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleSearchChange = (key) => (event) => {
        const value = event.target.value;
        setSearchQueries((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const renderDropdowns = () => {
        const keys = Object.entries(data);
        const middleIndex = Math.ceil(keys.length / 2);
        const leftSection = keys.slice(0, middleIndex);
        const rightSection = keys.slice(middleIndex);

        const renderSection = (section) =>
            section.map(([key, values], index) => (
                <Box key={index} sx={{ marginBottom: 2, width: "100%" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                        {key.replace(/_/g, " ").toUpperCase()}
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            value={selectedValues[key] || ""}
                            onChange={handleSelectChange(key)}
                            displayEmpty
                            MenuProps={{
                                disableAutoFocus: true,
                                disableEnforceFocus: true,
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                        overflowY: "auto",
                                        borderRadius: "8px",
                                    },
                                },
                            }}
                            renderValue={(selected) =>
                                selected ? selected : `Select ${key}`
                            }
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "8px",
                                fontSize: "14px",
                                "& .MuiSelect-select": {
                                    padding: "6px 8px",
                                },
                            }}
                        >
                            {/* Search Input */}
                            <Box
                                sx={{
                                    padding: 1,
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor: "#f1f1f1",
                                }}
                            >
                                <InputBase
                                    placeholder={`Search ${key}`}
                                    value={searchQueries[key] || ""}
                                    onChange={handleSearchChange(key)}
                                    sx={{
                                        width: "100%",
                                        padding: "4px 8px",
                                        fontSize: "14px",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                    }}
                                />
                            </Box>

                            {/* Filtered Options */}
                            {values
                                .filter((value) =>
                                    value
                                        .toString()
                                        .toLowerCase()
                                        .includes((searchQueries[key] || "").toLowerCase())
                                )
                                .map((value, idx) => (
                                    <MenuItem
                                        key={idx}
                                        value={value}
                                        sx={{
                                            fontSize: "14px",
                                            "&:hover": {
                                                backgroundColor: "#e0f7fa",
                                            },
                                        }}
                                    >
                                        {value}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Box>
            ));

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderSection(leftSection)}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderSection(rightSection)}
                </Grid>
            </Grid>
        );
    };

    return (
        <Layout>
            <Box
                sx={{
                    paddingY: 2,
                    paddingX: 2,
                    width: "95%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "0 auto",
                }}
            >
                <Typography variant="h6" align="center" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                    Unique Values Selection
                </Typography>

                <Card sx={{ backgroundColor: "#fff", borderRadius: "8px", padding: 3, width: "100%" }}>
                    <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                        {loading ? (
                            <ClipLoader color="#4A90E2" size={50} />
                        ) : Object.keys(data).length ? (
                            renderDropdowns()
                        ) : (
                            <Typography align="center">No data available.</Typography>
                        )}
                    </Box>
                </Card>
            </Box>

            <Box sx={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={() => navigate("/merged-data")}>
                    Back
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate("/fetch-unique-value")}>
                    Next
                </Button>
            </Box>
        </Layout>
    );
}

export default FetchUniqueValue;
