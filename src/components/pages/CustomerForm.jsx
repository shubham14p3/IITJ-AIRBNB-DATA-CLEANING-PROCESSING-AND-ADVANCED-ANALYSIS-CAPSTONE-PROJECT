import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import "./CustomerForm.css";
import customerImage from "../../assets/customer.webp";
import CustomField from "./CustomField";
import { BASE_URL } from "../Constant";
const CustomerForm = () => {
    const navigate = useNavigate();
    const prefilledData = {
        listing_id: "12345",
        name: "Luxury Apartment",
        available: "1",
        price: "250",
    };

    const handleSubmit = async (formData) => {

        try {
            // Remove the "type" field before submitting
            const { type, ...dataToSubmit } = formData;
            // Make the POST request to the endpoint
            const response = await fetch(`${BASE_URL}/api/append-end`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Server Response:", result);
                alert("Record appended successfully!");
            } else {
                const errorResult = await response.json();
                console.error("Error Response:", errorResult);
                alert(`Failed to append record: ${errorResult.message}`);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("An error occurred while submitting the form.");
        }
    };

    const handleBack = () => {
        navigate("/selection");
    };

    return (
        <Layout>
            <div className="form-container">
                <img src={customerImage} alt="Airbnb" className="airbnb-image" />
                <h1>You have selected Customer Form</h1>
                <CustomField prefilledData={prefilledData} onSubmit={handleSubmit} type={"Customer"} />
            </div><div className="button-group">
                <button type="button" onClick={() => navigate("/new-merged-data")}>
                    Back
                </button>
                <div className="button-group">
                    <button type="button" onClick={() => navigate("/new-merged-data")}
                    >
                        Next to View Saved Data
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default CustomerForm;
