import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import CustomField from "./CustomField";
import "./AirbnbForm.css";
import airbnbImage from "../../assets/airbnb.webp";

const AirbnbForm = () => {
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
                <img src={airbnbImage} alt="Airbnb" className="airbnb-image" />
                <h1>You have selected Airbnb</h1>
                <CustomField prefilledData={prefilledData} onSubmit={handleSubmit} type={'AIrBnb'} />
                <div className="button-group">
                    <button type="button" onClick={handleBack}>
                        Back
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default AirbnbForm;
