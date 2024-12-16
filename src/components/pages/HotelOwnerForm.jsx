import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import "./HotelOwnerForm.css";
import ownerImage from "../../assets/owner.webp";
import CustomField from "./CustomField";
const HotelOwnerForm = () => {
    const navigate = useNavigate();

    // Sample prefilled data (can be fetched or passed as props)
    const prefilledData = {
        listing_id: "12345",
        name: "Luxury Apartment",
        available: "1",
        price: "250",
    };

    const handleSubmit = (formData) => {
        console.log("Submitted Data:", formData);
    };

    const handleBack = () => {
        navigate("/selection");
    };

    return (
        <Layout>
            <div className="form-container">
                <img src={ownerImage} alt="Airbnb" className="airbnb-image"/>
                <h1>You have selected Hotel Owner Form</h1>
                <CustomField prefilledData={prefilledData} onSubmit={handleSubmit} type={"Hotel Owner"} />
            </div><div className="button-group">
                <button type="button" onClick={handleBack}>
                    Back
                </button>
                <button type="button" onClick={handleSubmit}>
                    Next
                </button>
            </div>
        </Layout>
    );
};

export default HotelOwnerForm;
