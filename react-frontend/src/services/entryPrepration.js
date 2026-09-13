const WEEKDAYS = {
  1: "Saturday",
  2: "Sunday",
  3: "Monday",
  4: "Tuesday",
  5: "Wednesday",
  6: "Thursday",
  7: "Friday",
};

const INJURY_TYPES = {
  1: "Fatal Accidents",
  2: "Serious Injury",
  3: "Slight Injury",
};

export function prepareEntries(data, type) {
  switch (type) {
    case "explorer":
      return prepareExplorerEntries(data);

    case "rate":
      return prepareRateEntries(data);
    
    case "population":
      return preparePopulationEntries(data);
    
    case "region":
      return prepareRegionEntries(data);

    default:
      return data;
  }
}

function prepareExplorerEntries(data) {
  return data.map((accident) => {
    const vehicles = [];

    if (accident.is_bicycle === 1) {
      vehicles.push("Bicycle");
    }

    if (accident.is_car === 1) {
      vehicles.push("Car");
    }

    if (accident.is_pedestrian === 1) {
      vehicles.push("Pedestrian");
    }

    if (accident.is_motorcycle === 1) {
      vehicles.push("Motorcycle");
    }

    return {
      accident_id: accident.accident_id,

      date: `${accident.year}-${String(accident.month).padStart(2, "0")}`,

      hour: accident.hour,

      weekday: WEEKDAYS[accident.weekday],

      category: INJURY_TYPES[accident.category],

      vehicle: vehicles.join(", "),

      ags: accident.ags,

      region_name: accident.region_name,
    };
  });
}


function prepareRateEntries(data) {
  return data.results.map((region) => ({
    region: region.region_name,
    accidents: Number(region.accidents),
    population: region.population_total,
    accidents_per_100k: Number(region.accidents_per_100k),

    injury_type:
      data.category === "all"
        ? "All"
        : data.category
            .split(",")
            .join(", "),

    accident_type:
      data.type === "all"
        ? "All"
        : data.type
            .split(",")
            .join(", "),
  }));
}

function preparePopulationEntries(data) {
  return data.map((region) => ({
    region: region.region_name,
    population: Number(region.population_total),
    year: region.year,
  }));
}

function prepareRegionEntries(data) {
  return data.map((region) => ({
    ags: region.ags,
    region: region.region_name,
  }));
}