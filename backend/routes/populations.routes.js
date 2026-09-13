const express = require("express");
const router = express.Router();

const {
  getPopulation
} = require("../controllers/populations.controller");


/**
 * @swagger
 * /population:
 *   get:
 *     summary: Retrieve population statistics
 *     description: |
 *       Returns population data for German administrative regions.
 *
 *       The endpoint supports filtering by year and region.
 *
 *       The `search` parameter supports:
 *       - Federal state code (first two AGS digits)
 *       - Complete AGS region code
 *       - Region name
 *
 *       Example requests:
 *       - http://localhost:3000/population
 *       - http://localhost:3000/population?year=2019
 *       - http://localhost:3000/population?search=11
 *       - http://localhost:3000/population?search=11000
 *       - http://localhost:3000/population?search=Berlin
 *       - http://localhost:3000/population?year=2019&search=Berlin
 *
 *     tags:
 *       - Population
 *
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         example: 2019
 *         description: Filter population records by year.
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         examples:
 *           stateCode:
 *             value: "11"
 *           agsCode:
 *             value: "11000"
 *           regionName:
 *             value: Berlin
 *         description: |
 *           Region search parameter.
 *
 *           Numeric values are interpreted as an AGS prefix.
 *           Text values are matched against the region name.
 *
 *           Supported formats:
 *           - Federal state code (e.g. 11)
 *           - AGS region code (e.g. 11000)
 *           - Region name (e.g. Berlin, Chemnitz, Leipzig)
 *
 *     responses:
 *       200:
 *         description: Population records successfully retrieved.
 *         content:
 *           application/json:
 *             examples:
 *               regionPopulation:
 *                 summary: Population of Berlin in 2019
 *                 value:
 *                   - ags: "11000"
 *                     region_name: "Berlin"
 *                     year: 2019
 *                     population_total: 3669491
 *
 *               statePopulation:
 *                 summary: Population data for regions matching a state code
 *                 value:
 *                   - ags: "14511"
 *                     region_name: "Chemnitz, Stadt"
 *                     year: 2019
 *                     population_total: 247237
 *                   - ags: "14713"
 *                     region_name: "Leipzig, Stadt"
 *                     year: 2019
 *                     population_total: 593145
 *
 *               populationHistory:
 *                 summary: Historical population values for Berlin
 *                 value:
 *                   - ags: "11000"
 *                     region_name: "Berlin"
 *                     year: 2016
 *                     population_total: 3520031
 *                   - ags: "11000"
 *                     region_name: "Berlin"
 *                     year: 2017
 *                     population_total: 3574830
 *                   - ags: "11000"
 *                     region_name: "Berlin"
 *                     year: 2018
 *                     population_total: 3644826
 *                   - ags: "11000"
 *                     region_name: "Berlin"
 *                     year: 2019
 *                     population_total: 3669491
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/",
  getPopulation
);

module.exports = router;