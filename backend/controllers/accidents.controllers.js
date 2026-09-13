const pool = require("../db");

const VEHICLE_COLUMNS = {
  car: "is_car",
  bicycle: "is_bicycle",
  pedestrian: "is_pedestrian",
  motorcycle: "is_motorcycle",
};

const INJURY_CATEGORIES = {
  "fatal accidents": 1,
  "serious injury": 2,
  "slight injury": 3,
};

function applyMultiFilter(
  sql,
  value,
  mapping,
  column,
  parameters,
  placeholder,
  mode = "value"
) {
  if (!value) {
    return { sql, placeholder };
  }

  const selectedValues = value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => mapping[item] !== undefined);

  if (selectedValues.length === 0) {
    return { sql, placeholder };
  }

  if (mode === "value") {
    const placeholders = selectedValues.map(
      () => `$${placeholder++}`
    );

    sql += `
      AND ${column} IN (${placeholders.join(", ")})
    `;

    parameters.push(
      ...selectedValues.map(
        (item) => mapping[item]
      )
    );
  }

  if (mode === "boolean") {
    const conditions = selectedValues.map(
      (item) => `${mapping[item]} = 1`
    );

    sql += `
      AND (${conditions.join(" OR ")})
    `;
  }

  return {
    sql,
    placeholder,
  };
}

function applyRegionSearch(sql, values, keyword, position) {

  if (!keyword) {
    return { sql, position };
  }

  // Numeric input is interpreted as an AGS prefix.
  if (/^\d+$/.test(keyword)) {

    sql += `
      AND a.ags LIKE $${position}
    `;

    values.push(`${keyword}%`);
  }

  // Text input is matched against region names.
  else {

    sql += `
      AND r.region_name ILIKE $${position}
    `;

    values.push(`%${keyword}%`);
  }

  return {
    sql,
    position: position + 1
  };
}

function sendDatabaseError(res, error) {

  console.error(error);

  return res.status(500).json({
    error: "Database error"
  });
}

exports.getAccidents = async (req, res) => {

  try {

    const {
      year,
      month,
      weekday,
      search,
      type,
      category,
      limit = 100
    } = req.query;

    let sql = `
      SELECT
        a.*,
        r.region_name
      FROM accidents a
      INNER JOIN regions r
        ON a.ags = r.ags
      WHERE 1 = 1
    `;

    const parameters = [];
    let placeholder = 1;

    // Apply optional year filter.
    if (year) {

      sql += `
        AND a.year = $${placeholder}
      `;

      parameters.push(year);
      placeholder++;
    }

    // Apply optional month filter.
    if (month) {

      sql += `
        AND a.month = $${placeholder}
      `;

      parameters.push(month);
      placeholder++;
    }

    // Apply optional weekday filter.
    if (weekday) {

      sql += `
        AND a.weekday = $${placeholder}
      `;

      parameters.push(weekday);
      placeholder++;
    }

    // Restrict results to a selected severity category.
    const categoryResult = applyMultiFilter(
      sql,
      category,
      INJURY_CATEGORIES,
      "a.category",
      parameters,
      placeholder,
      "value"
    );

    sql = categoryResult.sql;
    placeholder = categoryResult.placeholder;

    const searchResult = applyRegionSearch(
      sql,
      parameters,
      search,
      placeholder
    );

    sql = searchResult.sql;
    placeholder = searchResult.position;

    // Filter by participant type when requested.
    const typeResult = applyMultiFilter(
      sql,
      type,
      VEHICLE_COLUMNS,
      null,
      parameters,
      placeholder,
      "boolean"
    );

    sql = typeResult.sql;
    placeholder = typeResult.placeholder;

    sql += `
      ORDER BY a.accident_id
      LIMIT $${placeholder}
    `;

    parameters.push(limit);


    const result = await pool.query(
      sql,
      parameters
    );

    res.json(result.rows);

  } catch (error) {

    sendDatabaseError(
      res,
      error
    );

  }

};


exports.getAccidentTrend = async (req, res) => {

  try {

    const { search } = req.query;

    let sql = `
      SELECT
        year,
        COUNT(*) AS accidents
      FROM accidents a
      INNER JOIN regions r
        ON a.ags = r.ags
      WHERE 1 = 1
    `;

    const parameters = [];
    let placeholder = 1;

    // Restrict the trend to a specific region if provided.
    if (search) {

      sql += `
        AND (
          a.ags = $${placeholder}
          OR a.ags LIKE $${placeholder}
          OR LOWER(r.region_name)
             LIKE LOWER($${placeholder})
        )
      `;

      parameters.push(
        search.length === 2
          ? `${search}%`
          : `%${search}%`
      );

      placeholder++;
    }

    sql += `
      GROUP BY year
      ORDER BY year
    `;

    const result = await pool.query(
      sql,
      parameters
    );

    res.json(result.rows);

  } catch (error) {

    sendDatabaseError(
      res,
      error
    );

  }

};


exports.getFirstAvailableYear = async (req, res) => {
  try {
    const { search } = req.query;

    // Return the first year available for a specific state.
    if (search) {
      const result = await pool.query(
        `
        SELECT
          MIN(year) AS first_available_year
        FROM accidents
        WHERE ags LIKE $1
        `,
        [`${search}%`]
      );

      return res.json({
        search,
        first_available_year:
          result.rows[0].first_available_year,
      });
    }

    // Otherwise return the earliest year in the dataset.
    const result = await pool.query(`
      SELECT
        MIN(year) AS first_available_year
      FROM accidents
    `);

    res.json(result.rows[0]);

  } catch (error) {
    sendDatabaseError(res, error);
  }
};


exports.countAccidents = async (req, res) => {

  try {

    const {
      year,
      search,
      category,
      type
    } = req.query;

    let sql = `
      SELECT
        COUNT(*) AS accidents
      FROM accidents a
      INNER JOIN regions r
        ON a.ags = r.ags
      WHERE a.year = $1
    `;

    const parameters = [year];
    let placeholder = 2;

    const searchResult = applyRegionSearch(
      sql,
      parameters,
      search,
      placeholder
    );

    sql = searchResult.sql;
    placeholder = searchResult.position;

    // Restrict results to a selected severity category.
    const categoryResult = applyMultiFilter(
      sql,
      category,
      INJURY_CATEGORIES,
      "a.category",
      parameters,
      placeholder,
      "value"
    );

    sql = categoryResult.sql;
    placeholder = categoryResult.placeholder;


    // Filter by participant type when requested.
    const typeResult = applyMultiFilter(
      sql,
      type,
      VEHICLE_COLUMNS,
      null,
      parameters,
      placeholder,
      "boolean"
    );

    sql = typeResult.sql;
    placeholder = typeResult.placeholder;

    const result = await pool.query(
      sql,
      parameters
    );

    res.json({
      filters: req.query,
      accidents: Number(
        result.rows[0].accidents
      )
    });

  } catch (error) {

    sendDatabaseError(
      res,
      error
    );

  }

};


exports.getAccidentRate = async (req, res) => {

  try {

    const selectedYear =
      req.query.year || 2019;
    
    let placeholder = 2;

    const limit =
      parseInt(req.query.limit) || 10;

    const {
      category,
      type
    } = req.query;

    let sortDirection = "DESC";

    const sortOption =
      req.query.sort?.toLowerCase();

    // Highest rates are returned by default.
    if (sortOption === "lowest") {
      sortDirection = "ASC";
    }

    if (sortOption === "highest") {
      sortDirection = "DESC";
    }

    let sql = `
      SELECT
        r.region_name,

        COUNT(*) AS accidents,

        p.population_total,

        ROUND(
          COUNT(*) * 100000.0
          / p.population_total,
          2
        ) AS accidents_per_100k

      FROM accidents a

      INNER JOIN regions r
        ON a.ags = r.ags

      INNER JOIN population p
        ON a.ags = p.ags
       AND a.year = p.year

      WHERE a.year = $1
    `;

    const parameters = [
      selectedYear
    ];

    // Filter by participant type when requested.
    const typeResult = applyMultiFilter(
      sql,
      type,
      VEHICLE_COLUMNS,
      null,
      parameters,
      placeholder,
      "boolean"
    );

    sql = typeResult.sql;
    placeholder = typeResult.placeholder;

    // Restrict results to a selected severity category.
    const categoryResult = applyMultiFilter(
      sql,
      category,
      INJURY_CATEGORIES,
      "a.category",
      parameters,
      placeholder,
      "value"
    );

    sql = categoryResult.sql;
    placeholder = categoryResult.placeholder;

    sql += `
      GROUP BY
        r.region_name,
        p.population_total

      ORDER BY
        accidents_per_100k ${sortDirection}

      LIMIT $${parameters.length + 1}
    `;

    parameters.push(limit);

    const result = await pool.query(
      sql,
      parameters
    );

    res.json({
      year: selectedYear,
      type: type || "all",
      category: category || "all",
      sort: sortDirection,
      results: result.rows
    });

  } catch (error) {

    sendDatabaseError(
      res,
      error
    );

  }

};


exports.getMonthlySummary = async (req, res) => {

  try {

    const { year } = req.query;

    // Aggregate accidents by month for the selected year.
    const result = await pool.query(
      `
      SELECT
        month,
        COUNT(*) AS accidents
      FROM accidents
      WHERE year = $1
      GROUP BY month
      ORDER BY month
      `,
      [year]
    );

    res.json(
      result.rows
    );

  } catch (error) {

    sendDatabaseError(
      res,
      error
    );

  }

};


exports.getWeekdaySummary = async (req, res) => {

  try {

    const { year } = req.query;

    // Aggregate accidents by weekday for the selected year.
    const result = await pool.query(
      `
      SELECT
        weekday,
        COUNT(*) AS accidents
      FROM accidents
      WHERE year = $1
      GROUP BY weekday
      ORDER BY weekday
      `,
      [year]
    );

    res.json(
      result.rows
    );

  } catch (error) {

    sendDatabaseError(
      res,
      error
    );

  }

};