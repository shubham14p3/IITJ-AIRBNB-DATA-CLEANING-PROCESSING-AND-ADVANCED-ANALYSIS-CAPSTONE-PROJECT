import React, { useState } from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Box,
    Paper,
    Container,
} from "@mui/material";

const CustomField = ({ prefilledData = {}, onSubmit, type }) => {
    // Dropdown mappings for hard-coded fields
    const dropdownMappings = {
        available: {
            "0": "Not Available",
            "1": "Available",
        },
        cancellation_policy_id: {
            "0": "No Policy",
            "1": "Flexible",
            "2": "Moderate",
            "3": "Strict",
            "4": "Super Strict",
        },
        instant_bookable: {
            "0": "Not Instant Bookable",
            "1": "Instant Bookable",
        },
        room_type_id: {
            "1": "Private Room",
            "2": "Entire Place",
            "3": "Shared Room",
        },
    };

    // Default values for prefilled data
    const defaultValues = {
        listing_id: "12345",
        name: "Default Listing Name",
        available: "1",
        price: "100",
        minimum_nights: "1",
        maximum_nights: "30",
        cancellation_policy_id: "0",
        comments: "Default comments go here.",
        date: new Date().toISOString().split("T")[0],
        host_id: "host123",
        host_name: "Default Host",
        host_since: "2020-01-01",
        id_x: Math.random().toString(36).substring(2, 15),
        id_y: Math.random().toString(36).substring(2, 15),
        instant_bookable: "0",
        latitude: "40.7128",
        longitude: "-74.0060",
        neighbourhood: "Downtown",
        number_of_reviews: "10",
        review_scores_rating: "90",
        reviewer_id: "reviewer123",
        reviewer_name: "Default Reviewer",
        room_type_id: "1",
    };

    // Merge prefilledData with default values
    const [formData, setFormData] = useState({
        ...defaultValues,
        ...prefilledData, // This ensures prefilledData overrides defaults where provided
        type
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Render fields dynamically
    const renderField = (field) => {
        if (dropdownMappings[field]) {
            return (
                <TextField
                    select
                    fullWidth
                    label={field.replace(/_/g, " ").toUpperCase()}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                >
                    {Object.entries(dropdownMappings[field]).map(([key, displayValue]) => (
                        <MenuItem key={key} value={key}>
                            {displayValue}
                        </MenuItem>
                    ))}
                </TextField>
            );
        } else {
            const inputType =
                field === "price" || field.includes("nights")
                    ? "number"
                    : field === "date"
                        ? "date"
                        : "text";

            return (
                <TextField
                    fullWidth
                    type={inputType}
                    label={field.replace(/_/g, " ").toUpperCase()}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            );
        }
    };

    return (
        <Container maxWidth={false} style={{ padding: 0 }}>
            <Box component={Paper} padding={4} elevation={3}>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2} style={{ width: "100%", margin: 0 }}>
                        {Object.keys(formData).map((field) => (
                            <Grid item xs={12} md={6} key={field}>
                                {renderField(field)}
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
        
    );
};

export default CustomField;
