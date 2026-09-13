const express = require("express");
const router = express.Router();
const metadataController = require("../controllers/metadata.controllers");

/**
 * @swagger
 * /metadata:
 *   get:
 *     summary: Retrieve platform information
 *     description: |
 *       Returns general information about the Germany Traffic Accident
 *       Data Platform, including dataset integration and geographic coverage.
 *
 *       The platform integrates the accident, population, and region
 *       datasets using the official municipality identifier AGS.
 *
 *       AGS is constructed as:
 *       AGS = ULAND + UREGBEZ + UKREIS
 *
 *       Example request:
 *       - http://localhost:3000/metadata
 *
 *     tags:
 *       - Metadata
 *
 *     responses:
 *       200:
 *         description: Platform metadata successfully retrieved.
 *         content:
 *           application/json:
 *             example:
 *               project: "Germany Traffic Accident Data Platform"
 *               integration:
 *                 key: "ags"
 *                 name: "Amtlicher Gemeindeschlüssel"
 *                 construction: "AGS = ULAND + UREGBEZ + UKREIS"
 *                 description: "Official municipality identifier used to connect accident, population, and region datasets."
 *               geographicCoverage: "Germany"
 *               availableDatasets: 3
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/",
  metadataController.getMetadata
);


/**
 * @swagger
 * /metadata/datasets:
 *   get:
 *     summary: Retrieve information about all data sources
 *     description: |
 *       Returns metadata describing the datasets used in the platform.
 *
 *       The response includes:
 *       - Dataset name and table
 *       - Dataset summary
 *       - Source information
 *       - Coverage period
 *       - Primary key
 *       - Licence information
 *       - Additional notes where applicable
 *
 *       Available datasets:
 *       - Traffic Accidents
 *       - Population Statistics
 *       - Administrative Regions
 *
 *       Example request:
 *       - http://localhost:3000/metadata/datasets
 *
 *     tags:
 *       - Metadata
 *
 *     responses:
 *       200:
 *         description: Dataset metadata successfully retrieved.
 *         content:
 *           application/json:
 *             example:
 *               accidents:
 *                 dataset: "Traffic Accidents"
 *                 table: "accidents"
 *                 summary: "German traffic accident records including accident characteristics, severity levels, and involved road users."
 *                 source:
 *                   title: "Unfallatlas"
 *                   organisation: "Statistische Ämter des Bundes und der Länder"
 *                   portal: "Unfallatlas"
 *                   url: "https://unfallatlas.statistikportal.de/"
 *                 coverage:
 *                   from: 2016
 *                   to: 2024
 *                 primaryKey: "accident_id"
 *                 licence: "Data Licence Germany – Attribution – Version 2.0"
 *                 licenceUrl: "https://www.govdata.de/dl-de/by-2-0"
 *
 *               population:
 *                 dataset: "Population Statistics"
 *                 table: "population"
 *                 summary: "Annual population counts by administrative region used for demographic and accident rate analysis."
 *                 source:
 *                   title: "Population at Main Residence by Sex"
 *                   organisation: "Statistische Ämter des Bundes und der Länder"
 *                   portal: "GENESIS Regional"
 *                   url: "https://genesis.destatis.de/datenbank/online/statistic/12411/table/12411-0015/table-toolbar"
 *                 coverage:
 *                   from: 2016
 *                   to: 2024
 *                 primaryKey:
 *                   - "ags"
 *                   - "year"
 *                 licence: "Data Licence Germany – Attribution – Version 2.0"
 *                 licenceUrl: "https://www.govdata.de/dl-de/by-2-0"
 *                 notes:
 *                   - "Population in communal accommodation is excluded from 2017 onwards."
 *                   - "Methodological changes limit comparability with years before 2016."
 *
 *               regions:
 *                 dataset: "Administrative Regions"
 *                 table: "regions"
 *                 summary: "Reference dataset containing AGS identifiers, region names, and geographic coordinates."
 *                 source:
 *                   title: "Municipality Directory (GV-ISys)"
 *                   organisation: "Statistisches Bundesamt (Destatis)"
 *                   portal: "Regional Statistics"
 *                   url: "https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html"
 *                 coverage:
 *                   from: 2016
 *                   to: 2024
 *                 primaryKey: "ags"
 *                 reference: "German administrative region reference data"
 *                 licence: "Data Licence Germany – Attribution – Version 2.0"
 *                 licenceUrl: "https://www.govdata.de/dl-de/by-2-0"
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/datasets",
  metadataController.getDatasets
);

module.exports = router;