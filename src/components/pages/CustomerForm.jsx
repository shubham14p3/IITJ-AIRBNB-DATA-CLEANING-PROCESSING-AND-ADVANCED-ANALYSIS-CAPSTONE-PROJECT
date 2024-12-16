import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import "./CustomerForm.css";
import customerImage from "../../assets/customer.webp";
import CustomField from "./CustomField";
const CustomerForm = () => {
    const navigate = useNavigate();
    const prefilledData = {
        listing_id: "12345",
        name: "Luxury Apartment",
        available: "1",
        price: "250",
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Form Submitted", formData);
    };

    const handleBack = () => {
        navigate("/selection");
    };

    return (
        <Layout>
            <div className="form-container">
                <img src={customerImage} alt="Airbnb" className="airbnb-image"/>
                <h1>You have selected Customer Form</h1>
                <CustomField prefilledData={prefilledData} onSubmit={handleSubmit} type={"Customer"} />
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

export default CustomerForm;
