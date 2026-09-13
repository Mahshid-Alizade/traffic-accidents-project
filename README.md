# Germany Traffic Accident Data Platform

## Overview

This project combines multiple official German datasets into a single platform for exploring and analyzing road traffic accidents. The integrated data can be accessed through a REST API and a browser-based dashboard.

The platform includes:

* Traffic accident records
* Population statistics
* Administrative region information

The datasets are linked using the official **AGS (Amtlicher Gemeindeschlüssel)**, which uniquely identifies German administrative regions.

---

## Technologies

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Frontend:** HTML, CSS, JavaScript
* **Data Processing:** Python, Pandas
* **API Documentation:** Swagger/OpenAPI

---

## Project Structure

```text
DBW-PROJECT
│
├── backend/          # REST API and server
├── data/
│   ├── raw_data/     # Original datasets
│   ├── cleaned_data/ # Processed datasets
│   └── scripts/      # ETL scripts
├── frontend/         # Web application
├── database/         # Database schema
└── README.md
```

---

## Data Sources

The project integrates three official German datasets:

| Dataset                             | Coverage               |
| ----------------------------------- | ---------------------- |
| Traffic Accident Data (Unfallatlas) | 2016–2024              |
| Population Statistics               | 2016–2024              |
| Administrative Regions              | Current reference data |

The AGS code is used to connect all datasets during the ETL process.

---

## How to Run the Project

### Prerequisites

Make sure the following software is installed:

* PostgreSQL
* Node.js and npm
* Python 3

### Step 1 – Set Up the Database

Create a PostgreSQL database and execute the SQL schema:

```bash
psql -U <username> -d <database_name> -f database/schema.sql
```

Alternatively, you can use the provided `.env` file to connect to the existing database containing the processed data.

### Step 2 – Import the Data (Optional)

If you want to build the database from scratch, download the datasets from the official sources and place them in the `data/raw_data` directory. Then run the ETL scripts in the following order:

```bash
python data/scripts/clean_regions.py
python data/scripts/clean_population.py
python data/scripts/clean_accident.py
```

### Step 3 – Start the Backend

Navigate to the backend folder, install the required packages, and start the server:

```bash
cd backend
npm install
npm start
```

The REST API will be available at:

```text
http://localhost:3000
```

Swagger documentation can be accessed at:

```text
http://localhost:3000/api-docs
```

### Step 4 – Start the Frontend

Open a terminal in the frontend directory and start a local web server:

```bash
cd frontend
python -m http.server 8080
```

Then open the application in your browser:

```text
http://localhost:8080
```

The frontend communicates automatically with the backend API running on port **3000**.

## Available API Endpoints

| Endpoint                      | Purpose                                               |
| -----------------------       | -------------------------------                       |
| `/accidents`                  | Retrieve accident records                             |
| `/accidents/count`            | Count matching accidents                              |
| `/accidents/rate`             | Calculate accident rates                              |
| `/accidents/first-year`       | Return the first available year                       |
| `/accidents/trend`            | Show yearly accident trends                           |
| `/accidents/monthly-summary`  | Retrieve monthly accident totals for a selected year  |
| `/accidents/weekday-summary`  | Retrieve accident totals grouped by weekday           |
| `/population`                 | Retrieve population data                              |
| `/regions`                    | Search administrative regions                         |
| `/metadata`                   | Retrieve dataset information                          |

---

## Frontend Features

The web application provides the following pages:

* Dashboard
* Accident Explorer
* Accident Counter
* Accident Rate Analysis
* Trend Analysis
* Population Explorer
* Region Explorer
* Metadata Viewer

---

## Reproducibility

The project can be reproduced using the provided source code, SQL schema, and ETL scripts. Since the original datasets are publicly available, they can be downloaded directly from their official providers and processed using the included pipeline.

---

## Dataset Sources

* Traffic Accident Data: 
https://unfallatlas.statistikportal.de/
* Population Statistics: 
https://genesis.destatis.de/datenbank/online/statistic/12411/table/12411-0015/table-toolbar
* Administrative Regions: 
https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html

---

## License

The datasets are published under the **Data Licence Germany – Attribution – Version 2.0**.
https://www.govdata.de/dl-de/by-2-0
