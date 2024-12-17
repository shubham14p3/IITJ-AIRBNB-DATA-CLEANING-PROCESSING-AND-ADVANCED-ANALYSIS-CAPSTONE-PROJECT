# IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS
IITJ AIRBNB DATA CLEANING, PROCESSING AND ADVANCED ANALYSIS

[![Contributors][contributors-shield]][contributors-url]  
[![Forks][forks-shield]][forks-url]  
[![Stargazers][stars-shield]][stars-url]  
![Issues][issues-shield]

---

## Overview

This project focuses on cleaning, processing, and performing advanced analysis of Airbnb data to extract meaningful insights about host behaviors, guest preferences, and market trends. It integrates advanced visualization tools and data processing pipelines for comprehensive exploration and decision-making.

---
## Requirements
[Requirements](assets/Requirement.pdf)

## Project Report
[Project Report](assets/TheCapstone_project_report.pdf)

## Final Report & PPTx
[Final Report](assets/TheCapstone_project_report.pdf)

[Report](assets/Capstone_v1.pdf)

---

## Live Project Links
- **UI:** [http://3.222.77.245:5173/](http://3.222.77.245:5173/)
- **Backend:** [http://44.198.64.142:5000/](http://44.198.64.142:5000/)

---
---

## Data Sets
- **Review:** [Datasets Review](https://www.kaggle.com/datasets/shubham14p3/iitj-airbnb-capstone-review)
- **Listing:** [Datasets Listing](https://www.kaggle.com/datasets/shubham14p3/iitj-airbnb-capstone-listing)
- **Calendar:** [Datasets Calendar](https://www.kaggle.com/datasets/shubham14p3/iitj-airbnb-capstone-calendar)

---

## Setup Instructions

### Backend Setup

#### Step 1: Create and Activate Python Virtual Environment

1. **Create a Virtual Environment**:
    ```bash
    python -m venv venv
    ```

2. **Activate Virtual Environment**:
   - **Command Prompt**:
     ```bash
     venv\Scripts\activate
     ```
   - **PowerShell**:
     ```bash
     .\venv\Scripts\Activate
     ```
   - **Git Bash**:
     ```bash
     source venv/Scripts/activate
     ```

#### Step 2: Install Python Dependencies
Install the required Python packages using the `requirements.txt` file:
```bash
pip install -r requirements.txt
```

#### Step 3: Run the Flask Backend
Start the Flask app:
```bash
python run.py
```

---

### Frontend Setup

#### Step 1: Install Node.js Dependencies
Navigate to the `frontend/` directory and install the required packages:
```bash
npm install
```

#### Step 2: Run the Frontend Application
Start the development server:
```bash
npm start
```

---

## Folder Structure
```
project-root/
├── assets/                  # Contains all visualization images
│   ├── 1.JPG
│   ├── 2.JPG
│   ├── Price Distribution.JPG
│   ├── Room Type Distribution.JPG
│   ├── Top Hosts by Review Count.JPG
│   ├── Availability Over Time.JPG
│   ├── bucket_data.JPG
│   ├── Cancellation Policies Distribution.JPG
│   ├── clean_data.JPG
│   ├── eda.JPG
│   ├── Listings Bubble Chart.JPG
│   ├── login.JPG
│   ├── makeSelection.JPG
│   ├── merged_data.JPG
│   ├── Number of Reviews Distribution.JPG
│   ├── Price vs. Review Scores.JPG
│   ├── roles.JPG
│   ├── s3_bucket.JPG
│   ├── sprint_complete.JPG
│   ├── sql_connected.JPG
│   ├── table_created_in_rds.JPG
│   ├── Unique_value.JPG
│   ├── welcome.JPG
├── backend/                # Backend code
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── config.py           # Configuration file
│   ├── secrets.py          # Sensitive credentials (not included in repo)
│   ├── run.py              # Entry point for Flask app
├── frontend/               # Frontend React code
│   ├── src/                # React source files
│   │   ├── components/     # React components
│   │   ├── App.js          # Main application file
│   │   ├── index.js        # Entry point for React
├── README.md               # Project documentation
```

---

## Few Details & Screenshots

### Github Main Screen
![1](assets/1.JPG)
### Github Team Member
![2](assets/2.JPG)
### Jira Dashboard
![3](assets/3.JPG)
![3](assets/sprint_complete.JPG)
### Jira Flow
![4](assets/4.JPG)
### Login Screen
![4](assets/login.JPG)
![4](assets/welcome.JPG)
### AWS S3 / RDS Configuration
![5](assets/5.JPG)

![6](assets/6.JPG)
![6](assets/elastic_ip.JPG)

![7](assets/7.JPG)

![8](assets/8.JPG)

![9](assets/9.JPG)

![10](assets/10.JPG)

![11](assets/11.JPG)

![12](assets/12.JPG)

### UI Screen
![74](assets/Unique_value.JPG)
![24](assets/selection.JPG)
![34](assets/eda.JPG)
![44](assets/save3.JPG)
![54](assets/clean_data.JPG)
![64](assets/data_from_backend.JPG)

## Visualisations

### Room Type Distribution
![Room Type Distribution](assets/Room%20Type%20Distribution.JPG)

### Top Hosts by Review Count
![Top Hosts](assets/Top%20Hosts%20by%20Review%20Count.JPG)

### Availability Over Time
![Availability Over Time](assets/Availability%20Over%20Time.JPG)

### Number of Reviews Distribution
![Number of Reviews Distribution](assets/Number%20of%20Reviews%20Distribution.JPG)

### Listings Bubble Chart
![Listings Bubble Chart](assets/Listings%20Bubble%20Chart.JPG)

### Price Distribution
![Listings Bubble Chart](assets/Price_Distribution.JPG)

### Price vs Review Scores
![Listings Bubble Chart](assets/Price_vs_Review_Scores.JPG)

---
https://drive.google.com/drive/folders/1Gky54scr9xQxsmQjaLSyI1XJk8NLQoPZ

## Technologies Used

### Backend
- **Flask**
- **Flask-CORS**
- **Boto3** for AWS S3 integration
- **MySQL-Connector-Python**
- **Pandas** for data processing
- **Scikit-Learn** for analysis

### Frontend
- **React.js**
- **Chart.js**
- **Leaflet.js**
- **Recharts**
- **Bootstrap** for UI styling

### Hosting
- **AWS S3** for data storage
- **Elastic IP** for backend deployment

---

## Authors

👤 **Shubham Raj**  
- GitHub: [@ShubhamRaj](https://github.com/shubham14p3)  
- LinkedIn: [Shubham Raj](https://www.linkedin.com/in/shubham14p3/)

👤 **Bhagchandani Niraj**  
- GitHub: [@BhagchandaniNiraj](https://github.com/bhagchandaniniraj)  
- LinkedIn: [Niraj Bhagchandani](https://linkedin.com/in/niraj-bhagchandani-218280201)

👤 **Bhavesh Arora**  
- GitHub: [@BhaveshArora](https://github.com/bhavesharora02)  
- LinkedIn: [Bhavesh Arora](https://linkedin.com/in/bhavesh-arora-11b0a319b)

👤 **Jai Singh Kushwah**  
- GitHub: [@JaiSinghKushwah](https://github.com/jai12kushwah)  
- LinkedIn: [Jai Singh Kushwah](https://linkedin.com/in/jsk21)

👤 **Paras Panda**  
- GitHub: [@PARASPANDA](https://github.com/)  
- LinkedIn: [Paras Panda](https://linkedin.com/in/)

👤 **Jatin Shrivas**  
- GitHub: [@JATINSHRIVAS](https://github.com/)  
- LinkedIn: [Jatin Shrivas](https://linkedin.com/in/)

---

## Future Upgrades

- Expand visualizations to include correlations between variables.
- Introduce predictive models for price and availability.
- Enhance interactivity by integrating more map-based tools.

---

## Contributions

Feel free to contribute by creating pull requests or submitting issues. Suggestions for improving data processing methods, adding more visualizations, or optimizing the application are welcome.

---

## Show Your Support

Give a ⭐ if you like this project!

---

## Acknowledgments

- Supported by [IIT Jodhpur](https://www.iitj.ac.in/).
- Data sourced from [Airbnb Open Data Initiative](https://www.airbnb.com/).

---

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/shubham14p3/IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS-CAPSTONE-PROJECT.svg?style=flat-square
[contributors-url]: https://github.com/shubham14p3/IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS-CAPSTONE-PROJECT/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/shubham14p3/IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS-CAPSTONE-PROJECT.svg?style=flat-square
[forks-url]: https://github.com/shubham14p3/IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS-CAPSTONE-PROJECT/network/members
[stars-shield]: https://img.shields.io/github/stars/shubham14p3/IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS-CAPSTONE-PROJECT.svg?style=flat-square
[stars-url]: https://github.com/shubham14p3/IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS-CAPSTONE-PROJECT/stargazers
[issues-shield]: https://img.shields.io/github/issues/shubham14p3/IITJ-AIRBNB-DATA-CLEANING-PROCESSING-AND-ADVANCED-ANALYSIS-CAPSTONE-P

