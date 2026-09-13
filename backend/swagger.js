const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Germany Traffic Accident Data Platform",
      version: "1.0.0",
      description: `
A REST API providing access to integrated German traffic accident statistics.

## Available Data Sources

This platform combines the following official datasets:

- Traffic accident records (2016–2024)
- Population statistics
- Administrative regions and AGS reference data

## Data Integration

All datasets are linked using the official municipality identifier:

**AGS (Amtlicher Gemeindeschlüssel)**
The AGS code is constructed from three columns contained in the accident dataset:

AGS = ULAND + UREGBEZ + UKREIS

Where:

- ULAND = Federal State
- UREGBEZ = Administrative District (Regierungsbezirk)
- UKREIS = District (Kreis)

Example:

ULAND = 03  
UREGBEZ = 1  
UKREIS = 01  

AGS = 03101

This AGS code is used as the common key for integrating accident, population, and region data.

## Supported Operations

- Browse and filter accident records
- Retrieve accident counts
- Calculate accident rates per 100,000 inhabitants
- Explore accident trends over time
- Search administrative regions
- Access dataset metadata and licensing information

## Federal State Codes

| Code | State |
|------|--------|
| 01 | Schleswig-Holstein |
| 02 | Hamburg |
| 03 | Lower Saxony |
| 04 | Bremen |
| 05 | North Rhine-Westphalia |
| 06 | Hesse |
| 07 | Rhineland-Palatinate |
| 08 | Baden-Württemberg |
| 09 | Bavaria |
| 10 | Saarland |
| 11 | Berlin |
| 12 | Brandenburg |
| 13 | Mecklenburg-Western Pomerania |
| 14 | Saxony |
| 15 | Saxony-Anhalt |
| 16 | Thuringia |
`
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Environment"
      }
    ]
  },

  apis: ["./routes/*.js"]
};

module.exports = swaggerJsdoc(options);