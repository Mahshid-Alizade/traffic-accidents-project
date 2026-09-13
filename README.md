# Germany Traffic Accident Data Platform

## Overview

This project integrates multiple official German datasets into a single full-stack platform for exploring, analyzing, and visualizing road traffic accidents.

The integrated data is accessed through a REST API and presented through a modern, interactive web application.

The platform includes:

* Traffic accident records
* Population statistics
* Administrative region information

The datasets are linked using the official **AGS (Amtlicher Gemeindeschlüssel)**, which uniquely identifies German administrative regions.

The application provides interactive data exploration, filtering, statistical analysis, and data visualization of German traffic accident data.

---

## Live Demo

🌐 **Web Application:**  
https://traffic-accidents-project.vercel.app/

📚 **Swagger API Documentation:**  
https://traffic-accidents-project.onrender.com/api-docs

---

## Technologies

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL, Neon
* **Frontend:** React, Vite, JavaScript
* **Data Processing:** Python, Pandas
* **API Documentation:** Swagger/OpenAPI
* **Deployment:** GitHub, Vercel, Render

---

## Project Structure

```text
DBW-PROJECT
│
├── backend/                  # Node.js / Express REST API
│   ├── routes/               # API routes
│   ├── server.js             # Express server
│   ├── db.js                 # PostgreSQL connection
│   ├── swagger.js            # Swagger configuration
│   └── package.json
│
├── data/
│   ├── raw_data/             # Original datasets
│   ├── cleaned_data/         # Processed datasets
│   └── scripts/              # Python ETL scripts
│
├── database/                 # Database schema and SQL files
│
├── frontend/                 # Original/static frontend
│
├── react-frontend/           # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
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

The official **AGS** code is used to connect the datasets during the ETL process.

---

## Data Processing

The data processing pipeline was implemented using **Python and Pandas**.

The ETL process includes:

1. Cleaning and preparing administrative region data.
2. Cleaning and preparing population statistics.
3. Cleaning and preparing traffic accident data.
4. Linking the datasets using AGS codes.
5. Importing the processed data into PostgreSQL.

The processed data is then accessed by the backend through the REST API.

---

## Backend

The backend is implemented with **Node.js and Express.js**.

It provides REST API endpoints for retrieving accident, population, region, and metadata information.

### API Endpoints

| Endpoint                     | Purpose                                              |
| ---------------------------- | ---------------------------------------------------- |
| `/accidents`                 | Retrieve accident records                            |
| `/accidents/count`           | Count matching accidents                             |
| `/accidents/rate`            | Calculate accident rates                             |
| `/accidents/first-year`      | Return the first available year                      |
| `/accidents/trend`           | Show yearly accident trends                          |
| `/accidents/monthly-summary` | Retrieve monthly accident totals for a selected year |
| `/accidents/weekday-summary` | Retrieve accident totals grouped by weekday          |
| `/population`                | Retrieve population data                             |
| `/regions`                   | Search administrative regions                        |
| `/metadata`                  | Retrieve dataset information                         |

### Swagger Documentation

The API is documented using **Swagger / OpenAPI**.

When running locally, Swagger documentation is available at:

```text
http://localhost:3000/api-docs
```

---

## Frontend

The frontend was initially developed as a static web application and was later migrated to **React with Vite**.

The current frontend is a component-based React application using:

* **React Router** for navigation
* **Recharts** for charts and data visualization
* **Lucide React** for icons
* **Motion** for animations
* JavaScript for application logic

The React frontend communicates with the deployed Express REST API to retrieve and display data dynamically.

### Main Features

The application provides several interactive pages:

* Dashboard
* Accident Explorer
* Accident Counter
* Accident Rate Analysis
* Trend Analysis
* Population Explorer
* Region Explorer
* Metadata Viewer

Users can filter accident data by different criteria and explore the results through tables, statistics, and interactive charts.

---

## Running the Project Locally

### Prerequisites

Make sure the following software is installed:

* Node.js
* npm
* PostgreSQL
* Python 3

---

### Step 1 – Set Up the Database

Create a PostgreSQL database and execute the SQL schema:

```bash
psql -U <username> -d <database_name> -f database/schema.sql
```

Alternatively, the backend can be connected to an existing PostgreSQL database using environment variables.

Create a `.env` file inside the `backend` directory:

```env
DB_HOST=<database_host>
DB_PORT=5432
DB_NAME=<database_name>
DB_USER=<database_user>
DB_PASSWORD=<database_password>
PORT=3000
```

---

### Step 2 – Import the Data (Optional)

If the database needs to be built from scratch, download the datasets from their official sources and place them in the appropriate directories.

Then run the ETL scripts:

```bash
python data/scripts/clean_regions.py
python data/scripts/clean_population.py
python data/scripts/clean_accident.py
```

---

### Step 3 – Start the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The REST API will be available at:

```text
http://localhost:3000
```

Swagger documentation:

```text
http://localhost:3000/api-docs
```

---

### Step 4 – Start the React Frontend

Navigate to the React frontend:

```bash
cd react-frontend
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

---

## Deployment

The project is deployed using a modern cloud-based architecture:

```text
                    ┌──────────────────┐
                    │     GitHub       │
                    │   Source Code    │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
      ┌─────────────────┐          ┌─────────────────┐
      │     Vercel      │          │     Render      │
      │ React + Vite    │          │ Node + Express  │
      │    Frontend     │          │     Backend     │
      └────────┬────────┘          └────────┬────────┘
               │                            │
               │         REST API           │
               └───────────────────────────►│
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │      Neon       │
                                  │   PostgreSQL    │
                                  │    Database     │
                                  └─────────────────┘
```

### Production URLs

**Frontend:**

https://traffic-accidents-project.vercel.app/

**Backend:**

https://traffic-accidents-project.onrender.com

The React frontend communicates with the deployed Express backend through REST API requests.

---

## Reproducibility

The project can be reproduced using the provided:

* Source code
* Database schema
* Python ETL scripts
* Configuration files

The original datasets are publicly available from their official providers and can be downloaded and processed using the included ETL pipeline.

---

## Dataset Sources

### Traffic Accident Data

Unfallatlas:

https://unfallatlas.statistikportal.de/

### Population Statistics

GENESIS-Online:

https://genesis.destatis.de/datenbank/online/statistic/12411/table/12411-0015/table-toolbar

### Administrative Regions

Statistisches Bundesamt:

https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html

---

## License

The datasets are published under the:

**Data Licence Germany – Attribution – Version 2.0**

https://www.govdata.de/dl-de/by-2-0
