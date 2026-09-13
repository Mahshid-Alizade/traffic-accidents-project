const pool = require("../db");

/* ========= Data Sources ========= */
const dataSources = {

  accidents: {

    dataset: "Traffic Accidents",

    table: "accidents",

    summary:
      "German traffic accident records including accident characteristics, severity levels, and involved road users.",

    source: {
      title: "Unfallatlas",
      organisation:
        "Statistische Ämter des Bundes und der Länder",
      portal: "Unfallatlas",
      url:
        "https://unfallatlas.statistikportal.de/"
    },

    coverage: {
      from: 2016,
      to: 2024
    },

    primaryKey: "accident_id",

    licence:
      "Data Licence Germany – Attribution – Version 2.0",

    licenceUrl:
      "https://www.govdata.de/dl-de/by-2-0"

  },

  population: {

    dataset: "Population Statistics",

    table: "population",

    summary:
      "Annual population counts by administrative region used for demographic and accident rate analysis.",

    source: {
      title:
        "Population at Main Residence by Sex",
      organisation:
        "Statistische Ämter des Bundes und der Länder",
      portal:
        "GENESIS Regional",
      url:
        "https://genesis.destatis.de/datenbank/online/statistic/12411/table/12411-0015/table-toolbar"
    },

    coverage: {
      from: 2016,
      to: 2024
    },

    primaryKey: [
      "ags",
      "year"
    ],

    licence:
      "Data Licence Germany – Attribution – Version 2.0",

    licenceUrl:
      "https://www.govdata.de/dl-de/by-2-0",

    notes: [
      "Population in communal accommodation is excluded from 2017 onwards.",
      "Methodological changes limit comparability with years before 2016."
    ]

  },

  regions: {

    dataset: "Administrative Regions",

    table: "regions",

    summary:
      "Reference dataset containing AGS identifiers, region names, and geographic coordinates.",

    source: {
      title:
        "Municipality Directory (GV-ISys)",
      organisation:
        "Statistisches Bundesamt (Destatis)",
      portal:
        "Regional Statistics",
      url:
        "https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html"
    },

    primaryKey: "ags",

    reference:
      "German administrative region reference data",

    licence:
      "Data Licence Germany – Attribution – Version 2.0",

    licenceUrl:
      "https://www.govdata.de/dl-de/by-2-0"

  }

};

/* ========= Metadata Endpoint ========= */
exports.getMetadata = async (req, res) => {

  try {

    res.json({

      project:
        "Germany Traffic Accident Data Platform",

      integration: {

        key: "ags",

        name:
          "Amtlicher Gemeindeschlüssel",

        construction:
          "AGS = ULAND + UREGBEZ + UKREIS",

        description:
          "Official municipality identifier used to connect accident, population, and region datasets."

      },

      geographicCoverage:
        "Germany",

      availableDatasets:
        Object.keys(dataSources).length

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Database error"
    });

  }

};

/* ========= Dataset Metadata Endpoint ========= */
exports.getDatasets = async (req, res) => {

  try {

    res.json(dataSources);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Database error"
    });

  }

};