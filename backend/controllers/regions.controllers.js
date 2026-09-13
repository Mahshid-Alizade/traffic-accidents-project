// Database connection
const pool = require("../db");

exports.getRegions = async (req, res) => {

  try {

    const searchTerm = req.query.search;

    const queryParts = [
      `
      SELECT
        *
      FROM regions
      `
    ];

    const params = [];

    // Apply optional search criteria
    if (searchTerm) {

      const numericSearch =
        /^\d+$/.test(searchTerm);

      if (numericSearch) {

        queryParts.push(`
          WHERE ags LIKE $1
        `);

        params.push(
          `${searchTerm}%`
        );

      } else {

        queryParts.push(`
          WHERE region_name ILIKE $1
        `);

        params.push(
          `%${searchTerm}%`
        );

      }

    }

    queryParts.push(`
      ORDER BY region_name
    `);

    const sql = queryParts.join("\n");

    const { rows } = await pool.query(
      sql,
      params
    );

    return res.json(rows);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Database error"
    });

  }

};