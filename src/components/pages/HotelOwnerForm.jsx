import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import "./HotelOwnerForm.css";
import ownerImage from "../../assets/owner.webp";
import CustomField from "./CustomField";
import { BASE_URL } from "../Constant";
const HotelOwnerForm = () => {
    const navigate = useNavigate();

    // Sample prefilled data (can be fetched or passed as props)
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
                <img src={ownerImage} alt="Airbnb" className="airbnb-image" />
                <h1>You have selected Hotel Owner Form</h1>
                <CustomField prefilledData={prefilledData} onSubmit={handleSubmit} type={"Hotel Owner"} />
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

export default HotelOwnerForm;
