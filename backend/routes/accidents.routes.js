const express = require("express");
const router = express.Router();

const {
  getAccidents,
  getFirstAvailableYear,
  countAccidents,
  getAccidentRate,
  getAccidentTrend,
  getMonthlySummary,
  getWeekdaySummary
} = require("../controllers/accidents.controllers");


/**
 * @swagger
 * /accidents:
 *   get:
 *     summary: Retrieve accident records with optional filtering
 *     description: |
 *       Returns accident entries from the database and allows
 *       filtering through query parameters.
 *
 *       The `search` parameter supports:
 *       - Federal state code (first two AGS digits)
 *       - Complete AGS region code
 *       - Region name
 *
 *       Severity categories:
 *       - 1 = Fatal accident
 *       - 2 = Serious injury accident
 *       - 3 = Slight injury accident
 *
 *       Example requests:
 *       - http://localhost:3000/accidents
 *       - http://localhost:3000/accidents?year=2023
 *       - http://localhost:3000/accidents?year=2023&type=pedestrian
 *       - http://localhost:3000/accidents?category=1
 *       - http://localhost:3000/accidents?search=Berlin
 *       - http://localhost:3000/accidents?search=11
 *       - http://localhost:3000/accidents?search=11000
 *       - http://localhost:3000/accidents?year=2023&type=bicycle,car&category=2,3
 *
 *     tags:
 *       - Accidents
 *
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         example: 2023
 *         description: Restrict results to a specific year.
 *
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 6
 *         description: Restrict results to a specific month.
 *
 *       - in: query
 *         name: weekday
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 7
 *         example: 2
 *         description: Filter accidents by weekday.
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Berlin
 *         description: |
 *           Region search value.
 *
 *           Accepted formats:
 *           - State code (e.g. 11)
 *           - AGS code (e.g. 11000)
 *           - Region name (e.g. Berlin, Dresden, Leipzig)
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         examples:
 *           single:
 *             value: "2"
 *           multiple:
 *             value: "2,3"
 *         description: |
 *           Accident severity filter.
 *
 *           Multiple categories can be provided as comma-separated values.
 *
 *           - 1 = Fatal accident
 *           - 2 = Serious injury accident
 *           - 3 = Slight injury accident
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         examples:
 *           single:
 *             value: bicycle
 *           multiple:
 *             value: bicycle,car
 *         description: |
 *           Participant type filter.
 *
 *           Multiple participant types can be provided as comma-separated values.
 *
 *           Supported values:
 *           - pedestrian
 *           - bicycle
 *           - car
 *           - motorcycle
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         example: 50
 *         description: Maximum number of records returned.
 *
 *     responses:
 *       200:
 *         description: Accident records successfully retrieved.
 *         content:
 *           application/json:
 *             example:
 *               - accident_id: 12345
 *                 year: 2023
 *                 month: 6
 *                 weekday: 2
 *                 category: 2
 *                 accident_type: 1
 *                 is_pedestrian: 1
 *                 is_bicycle: 0
 *                 is_car: 0
 *                 is_motorcycle: 0
 *                 light_condition: 0
 *                 ags: "11000"
 *                 region_name: "Berlin"
 *
 *       500:
 *         description: Database error.
 */
router.get("/", getAccidents);


/**
 * @swagger
 * /accidents/first-year:
 *   get:
 *     summary: Retrieve the earliest available accident year
 *     description: |
 *       Returns the first year for which accident information exists.
 *
 *       Without a search parameter, the earliest year in the entire
 *       dataset is returned.
 *
 *       With a search parameter, the earliest year available for the
 *       specified region is returned.
 *
 *       Example requests:
 *       - http://localhost:3000/accidents/first-year
 *       - http://localhost:3000/accidents/first-year?search=05
 *
 *     tags:
 *       - Accidents
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: "05"
 *         description: |
 *           Region search value.
 *
 *           The value is interpreted as an AGS prefix.
 *
 *     responses:
 *       200:
 *         description: Earliest available accident year.
 *         content:
 *           application/json:
 *             example:
 *               search: "05"
 *               first_available_year: 2016
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/first-year",
  getFirstAvailableYear
);


/**
 * @swagger
 * /accidents/count:
 *   get:
 *     summary: Count accidents using optional filters
 *     description: |
 *       Returns the total number of accidents matching
 *       the supplied filter criteria.
 *
 *       Example requests:
 *       - http://localhost:3000/accidents/count?year=2018
 *       - http://localhost:3000/accidents/count?year=2018&search=Berlin
 *       - http://localhost:3000/accidents/count?year=2018&type=pedestrian
 *       - http://localhost:3000/accidents/count?year=2018&type=bicycle,car
 *       - http://localhost:3000/accidents/count?year=2018&category=2,3
 *
 *     tags:
 *       - Accidents
 *
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2023
 *         description: Accident year.
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Berlin
 *         description: |
 *           Region filter.
 *
 *           Accepted values:
 *           - State code
 *           - AGS code
 *           - Region name
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         examples:
 *           single:
 *             value: "2"
 *           multiple:
 *             value: "2,3"
 *         description: |
 *           Accident severity filter.
 *
 *           Multiple categories can be provided as comma-separated values.
 *
 *           - 1 = Fatal accident
 *           - 2 = Serious injury accident
 *           - 3 = Slight injury accident
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         examples:
 *           single:
 *             value: bicycle
 *           multiple:
 *             value: bicycle,car
 *         description: |
 *           Participant type filter.
 *
 *           Multiple participant types can be provided as comma-separated values.
 *
 *           Supported values:
 *           - pedestrian
 *           - bicycle
 *           - car
 *           - motorcycle
 *
 *     responses:
 *       200:
 *         description: Matching accident count.
 *         content:
 *           application/json:
 *             example:
 *               filters:
 *                 year: "2023"
 *                 search: "Berlin"
 *                 category: "2"
 *                 type: "pedestrian"
 *               accidents: 4321
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/count",
  countAccidents
);


/**
 * @swagger
 * /accidents/rate:
 *   get:
 *     summary: Calculate accident rates per 100,000 residents
 *     description: |
 *       Computes accident rates for German districts by combining
 *       accident records, regional information, and population data.
 *
 *       Example requests:
 *       - http://localhost:3000/accidents/rate
 *       - http://localhost:3000/accidents/rate?year=2019&sort=highest
 *       - http://localhost:3000/accidents/rate?year=2019&sort=lowest
 *       - http://localhost:3000/accidents/rate?year=2019&type=bicycle
 *       - http://localhost:3000/accidents/rate?year=2019&type=bicycle,car
 *       - http://localhost:3000/accidents/rate?year=2019&category=1
 *       - http://localhost:3000/accidents/rate?year=2019&category=2,3
 *
 *     tags:
 *       - Accidents
 *
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           default: 2019
 *         example: 2019
 *         description: Year used for the rate calculation.
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         examples:
 *           single:
 *             value: bicycle
 *           multiple:
 *             value: bicycle,car
 *         description: |
 *           Participant type filter.
 *
 *           Multiple participant types can be provided as comma-separated values.
 *
 *           Supported values:
 *           - bicycle
 *           - pedestrian
 *           - car
 *           - motorcycle
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         examples:
 *           single:
 *             value: "2"
 *           multiple:
 *             value: "2,3"
 *         description: |
 *           Severity filter.
 *
 *           Multiple categories can be provided as comma-separated values.
 *
 *           - 1 = Fatal accident
 *           - 2 = Serious injury accident
 *           - 3 = Slight injury accident
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - highest
 *             - lowest
 *         example: highest
 *         description: |
 *           Ranking direction.
 *
 *           - highest = largest accident rates first
 *           - lowest = smallest accident rates first
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *         description: Maximum number of districts returned.
 *
 *     responses:
 *       200:
 *         description: Accident rate calculation completed successfully.
 *         content:
 *           application/json:
 *             example:
 *               year: 2019
 *               type: "bicycle"
 *               category: "2,3"
 *               sort: "DESC"
 *               results:
 *                 - region_name: "Dresden, Stadt"
 *                   accidents: 1450
 *                   population_total: 556780
 *                   accidents_per_100k: 260.42
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/rate",
  getAccidentRate
);


/**
 * @swagger
 * /accidents/trend:
 *   get:
 *     summary: Retrieve accident trends over time
 *     description: |
 *       Returns yearly accident totals and can be filtered
 *       by region identifiers or names.
 *
 *       Example requests:
 *       - http://localhost:3000/accidents/trend
 *       - http://localhost:3000/accidents/trend?search=Berlin
 *       - http://localhost:3000/accidents/trend?search=11
 *       - http://localhost:3000/accidents/trend?search=14511
 *
 *     tags:
 *       - Accidents
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Berlin
 *         description: |
 *           Region filter.
 *
 *           Accepted values:
 *           - Region name
 *           - Federal state code
 *           - AGS region code
 *
 *     responses:
 *       200:
 *         description: Accident totals grouped by year.
 *         content:
 *           application/json:
 *             example:
 *               - year: 2016
 *                 accidents: 5321
 *               - year: 2017
 *                 accidents: 5480
 *               - year: 2018
 *                 accidents: 5612
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/trend",
  getAccidentTrend
);


/**
 * @swagger
 * /accidents/monthly-summary:
 *   get:
 *     summary: Retrieve monthly accident totals
 *     description: |
 *       Returns accident counts aggregated by month for a selected year.
 *
 *       Example requests:
 *       - http://localhost:3000/accidents/monthly-summary?year=2023
 *
 *     tags:
 *       - Accidents
 *
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2023
 *         description: Year for which monthly statistics should be generated.
 *
 *     responses:
 *       200:
 *         description: Monthly accident totals.
 *         content:
 *           application/json:
 *             example:
 *               - month: 1
 *                 accidents: 4200
 *               - month: 2
 *                 accidents: 3900
 *               - month: 3
 *                 accidents: 4500
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/monthly-summary",
  getMonthlySummary
);


/**
 * @swagger
 * /accidents/weekday-summary:
 *   get:
 *     summary: Retrieve accident totals by weekday
 *     description: |
 *       Returns accident counts grouped by weekday for a selected year.
 *
 *       Example requests:
 *       - http://localhost:3000/accidents/weekday-summary?year=2023
 *
 *     tags:
 *       - Accidents
 *
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2023
 *         description: Year used for weekday aggregation.
 *
 *     responses:
 *       200:
 *         description: Weekday accident totals.
 *         content:
 *           application/json:
 *             example:
 *               - weekday: 1
 *                 accidents: 5300
 *               - weekday: 2
 *                 accidents: 5100
 *               - weekday: 3
 *                 accidents: 5400
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/weekday-summary",
  getWeekdaySummary
);

module.exports = router;