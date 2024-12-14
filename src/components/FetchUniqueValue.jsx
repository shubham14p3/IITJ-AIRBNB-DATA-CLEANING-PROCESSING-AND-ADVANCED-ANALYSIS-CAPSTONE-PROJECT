import React, { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Card,
    Grid,
    Button,
} from "@mui/material";
import { BASE_URL } from "./Constant";
import Layout from "../layout/Layout";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

function FetchUniqueValue() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedValues, setSelectedValues] = useState({});
    const navigate = useNavigate();

    const fetchUniqueValues = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/fetch-unique-values`);
            if (!response.ok) throw new Error("Failed to fetch unique values");
            const result = await response.json();

            if (result.status && result.data) {
                setData(result.data);
                const initialSelection = Object.keys(result.data).reduce(
                    (acc, key) => ({ ...acc, [key]: "" }),
                    {}
                );
                setSelectedValues(initialSelection);
            } else {
                console.error("No data available:", result.message);
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching unique values:", error);
            setData([]);
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

    const renderDropdowns = () => {
        const keys = Object.entries(data);
        const middleIndex = Math.ceil(keys.length / 2);
        const leftSection = keys.slice(0, middleIndex);
        const rightSection = keys.slice(middleIndex);

        const renderSection = (section) =>
            section.map(([key, values], index) => (
                <Box
                    key={index}
                    sx={{
                        marginBottom: 2,
                        width: "100%",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", marginBottom: 1 }}
                    >
                        {key.replace(/_/g, " ").toUpperCase()}
                    </Typography>
                    <FormControl fullWidth>
                        <Select
                            value={selectedValues[key] || ""}
                            onChange={handleSelectChange(key)}
                            displayEmpty
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "4px",
                                "& .MuiSelect-select": {
                                    padding: "10px",
                                },
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select {key}
                            </MenuItem>
                            {values.map((value, idx) => (
                                <MenuItem key={idx} value={value}>
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
                <Typography
                    variant="h6"
                    align="center"
                    sx={{ fontWeight: "bold", color: "#333", marginBottom: 2 }}
                >
                    Unique Values Selection
                </Typography>

                <Card
                    sx={{
                        backgroundColor: "#fff",
                        boxShadow: 2,
                        borderRadius: 4,
                        padding: 2,
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            maxHeight: "400px",
                            overflowY: "scroll",
                            overflowX: "auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px",
                        }}
                    >
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

            <Box marginTop={4} display="flex" justifyContent="space-between">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/merged-data")}
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

        </Layout>
    );
}

export default FetchUniqueValue;
