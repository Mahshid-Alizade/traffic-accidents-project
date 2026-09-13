const express = require("express");
const router = express.Router();

const {
  getRegions
} = require("../controllers/regions.controllers");


/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Retrieve administrative region information
 *     description: |
 *       Returns information about German administrative regions,
 *       including AGS identifiers, region names, and geographic coordinates.
 *
 *       The endpoint supports optional searching by AGS code or region name.
 *
 *       The `search` parameter supports:
 *       - Full AGS identifier
 *       - Federal state prefix (first two AGS digits)
 *       - Region name
 *
 *       Example requests:
 *       - http://localhost:3000/regions
 *       - http://localhost:3000/regions?search=11
 *       - http://localhost:3000/regions?search=14511
 *       - http://localhost:3000/regions?search=Berlin
 *       - http://localhost:3000/regions?search=Chemnitz
 *
 *     tags:
 *       - Regions
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         examples:
 *           stateCode:
 *             value: "14"
 *           agsCode:
 *             value: "14511"
 *           regionName:
 *             value: Berlin
 *         description: |
 *           Optional region search value.
 *
 *           Numeric values are interpreted as an AGS prefix.
 *           Text values are matched against the region name.
 *
 *           Examples:
 *           - 11 → regions whose AGS starts with 11
 *           - 14 → regions whose AGS starts with 14
 *           - 14511 → Chemnitz
 *           - Berlin → regions with "Berlin" in their name
 *
 *           If omitted, all available regions are returned.
 *
 *     responses:
 *       200:
 *         description: Region data successfully returned.
 *         content:
 *           application/json:
 *             examples:
 *
 *               allRegions:
 *                 summary: Complete region dataset
 *                 value:
 *                   - ags: "11000"
 *                     region_name: "Berlin"
 *                     longitude: 13.4050
 *                     latitude: 52.5200
 *
 *               agsLookup:
 *                 summary: Lookup using an AGS code
 *                 value:
 *                   - ags: "14511"
 *                     region_name: "Chemnitz, Stadt"
 *                     longitude: 12.9204
 *                     latitude: 50.8278
 *
 *               stateLookup:
 *                 summary: Lookup using a federal state prefix
 *                 value:
 *                   - ags: "14511"
 *                     region_name: "Chemnitz, Stadt"
 *                     longitude: 12.9204
 *                     latitude: 50.8278
 *                   - ags: "14713"
 *                     region_name: "Leipzig, Stadt"
 *                     longitude: 12.3731
 *                     latitude: 51.3397
 *
 *               regionNameLookup:
 *                 summary: Search by region name
 *                 value:
 *                   - ags: "11000"
 *                     region_name: "Berlin"
 *                     longitude: 13.4050
 *                     latitude: 52.5200
 *                   - ags: "11001"
 *                     region_name: "Berlin-Mitte"
 *                     longitude: 13.3870
 *                     latitude: 52.5250
 *
 *       500:
 *         description: Database error.
 */
router.get(
  "/",
  getRegions
);

module.exports = router;