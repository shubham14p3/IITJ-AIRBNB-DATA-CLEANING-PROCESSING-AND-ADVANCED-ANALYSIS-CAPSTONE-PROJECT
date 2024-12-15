import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import "./AirbnbForm.css";
import airbnbImage from "../../assets/airbnb.webp";

const AirbnbForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Form Submitted", formDatas);
    };

    const handleBack = () => {
        navigate("/selection");
    };

    return (
        <Layout>
            <div className="form-container">
            <img src={airbnbImage} alt="Airbnb" className="airbnb-image" />
                <h1>You have selected Airbnb</h1>
                <form className="form">
                    <label>
                        Name:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </label>
                    <label>
                        Phone:
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </label>
                    <button type="button" onClick={handleSubmit}>
                        Submit
                    </button>
                </form>
            </div>
            <div className="button-group">
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

export default AirbnbForm;
