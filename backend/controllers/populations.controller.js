const pool = require("../db");

exports.getPopulation = async (req, res) => {

  try {

    const { year, search } = req.query;

    const sqlParts = [`
      SELECT
        p.ags,
        r.region_name,
        p.year,
        p.population_total
      FROM population p
      JOIN regions r
        ON p.ags = r.ags
      WHERE TRUE
    `];

    const params = [];

    const addFilter = (condition, value) => {
      params.push(value);
      sqlParts.push(
        `${condition} $${params.length}`
      );
    };

    // Filter by year
    if (year) {

      addFilter(
        "AND p.year =",
        year
      );

    }

    // Search by AGS/state code or region name
    if (search) {

      if (/^\d+$/.test(search)) {

        addFilter(
          "AND p.ags LIKE",
          `${search}%`
        );

      } else {

        addFilter(
          "AND r.region_name ILIKE",
          `%${search}%`
        );

      }

    }

    sqlParts.push(`
      ORDER BY
        p.year,
        r.region_name
    `);

    const query = sqlParts.join("\n");

    const { rows } = await pool.query(
      query,
      params
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Database error"
    });

  }

};