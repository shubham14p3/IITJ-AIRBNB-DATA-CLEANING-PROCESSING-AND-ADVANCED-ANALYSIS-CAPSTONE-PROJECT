import React, { useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    Grid,
    Button,
    Popover,
    List,
    ListItemButton,
    InputBase,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchUniqueValues } from "../slice/uniqueValuesSlice";
import Layout from "../layout/Layout";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";

const CustomSearchDropdown = ({ label, values, onSelect, selectedValue }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [search, setSearch] = React.useState("");
    const [filteredValues, setFilteredValues] = React.useState(values);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setFilteredValues(values); // Reset search filter on open
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearch(""); // Clear search input
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        setFilteredValues(values.filter((val) => val.toLowerCase().includes(query)));
    };

    const handleSelect = (value) => {
        onSelect(value);
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ marginBottom: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                {label.toUpperCase()}
            </Typography>
            <Box
                sx={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                }}
                onClick={handleOpen}
            >
                {selectedValue || `Select ${label}`}
            </Box>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                PaperProps={{ style: { maxHeight: 300, width: "250px" } }}
                disableEnforceFocus // Prevents focus conflicts
                disableAutoFocus    // Prevents auto-focus on the Popover
            >
                <Box sx={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    <InputBase
                        placeholder={`Search ${label}`}
                        value={search}
                        onChange={handleSearchChange}
                        sx={{ width: "100%", padding: "4px" }}
                    />
                </Box>
                <List>
                    {filteredValues.map((value, idx) => (
                        <ListItemButton key={idx} onClick={() => handleSelect(value)}>
                            {value}
                        </ListItemButton>
                    ))}
                    {filteredValues.length === 0 && (
                        <Typography sx={{ padding: "8px", textAlign: "center" }}>
                            No results found
                        </Typography>
                    )}
                </List>
            </Popover>
        </Box>
    );
};

function FetchUniqueValue() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, loading, error } = useSelector((state) => state.uniqueValues);
    const [selectedValues, setSelectedValues] = React.useState({});
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    useEffect(() => {
        if (Object.keys(data).length === 0) {
            dispatch(fetchUniqueValues());
        }
    }, [dispatch, data]);

    useEffect(() => {
        if (data && Object.keys(data).length) {
            const initialSelection = Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
            setSelectedValues(initialSelection);
        }
    }, [data]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        dispatch(fetchUniqueValues()).finally(() => setIsRefreshing(false));
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "unique-values.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderDropdowns = () => {
        const keys = Object.entries(data);
        const middleIndex = Math.ceil(keys.length / 2);
        const leftSection = keys.slice(0, middleIndex);
        const rightSection = keys.slice(middleIndex);

        const renderSection = (section) =>
            section.map(([key, values], index) => (
                <CustomSearchDropdown
                    key={index}
                    label={key.replace(/_/g, " ")}
                    values={values.map(String)} // Ensure values are strings for comparison
                    onSelect={(value) =>
                        setSelectedValues((prev) => ({ ...prev, [key]: value }))
                    }
                    selectedValue={selectedValues[key]}
                />
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
            {loading || isRefreshing ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <ClipLoader color="#4A90E2" size={50} />
                </Box>
            ) : (
                <Box sx={{ paddingY: 2, paddingX: 2, width: "95%", margin: "0 auto" }}>
                    <Typography variant="h6" align="center" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                        Unique Values Selection
                    </Typography>

                    <Card sx={{ backgroundColor: "#fff", borderRadius: "8px", padding: 3, width: "100%" }}>
                        {error ? (
                            <Typography align="center" color="error">
                                {error}
                            </Typography>
                        ) : Object.keys(data).length ? (
                            <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}>{renderDropdowns()}</Box>
                        ) : (
                            <Typography align="center">No data available.</Typography>
                        )}
                    </Card>

                    <Box sx={{ marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                        <Button variant="contained" color="primary" onClick={handleRefresh}>
                            Refresh
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDownload}>
                            Download JSON
                        </Button>
                    </Box>
                </Box>
            )}

            <Box sx={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={() => navigate("/merged-data")}>
                    Back
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate("/fetch-unique-value")}>
                    Next
                </Button>
            </Box>
            <br />
            <br />
        </Layout>
    );
}

export default FetchUniqueValue;
