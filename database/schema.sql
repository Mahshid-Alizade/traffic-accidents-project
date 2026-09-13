-- ==================================================
-- German Traffic Accident Analysis Database
-- ==================================================

DROP TABLE IF EXISTS accidents CASCADE;
DROP TABLE IF EXISTS population CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

CREATE TABLE regions (
    ags VARCHAR(5) PRIMARY KEY,
    region_name VARCHAR(255) NOT NULL,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6)
);

CREATE TABLE population (
    ags VARCHAR(5)
        REFERENCES regions(ags)
        ON DELETE CASCADE,

    year INT NOT NULL,
    population_total INT NOT NULL,

    PRIMARY KEY (ags, year)
);

CREATE TABLE accidents (

    accident_id BIGSERIAL PRIMARY KEY,

    ags VARCHAR(5) NOT NULL
        REFERENCES regions(ags),

    year SMALLINT NOT NULL,
    month SMALLINT NOT NULL,
    weekday SMALLINT,
    hour SMALLINT,

    category SMALLINT,
    accident_type SMALLINT,

    is_bicycle SMALLINT,
    is_car SMALLINT,
    is_pedestrian SMALLINT,
    is_motorcycle SMALLINT,

    light_condition SMALLINT,

    CHECK (month BETWEEN 1 AND 12),
    CHECK (weekday BETWEEN 1 AND 7)
);

CREATE INDEX accidents_region_idx
    ON accidents(ags);

CREATE INDEX accidents_year_idx
    ON accidents(year);

CREATE INDEX population_region_idx
    ON population(ags);

CREATE INDEX population_year_idx
    ON population(year);