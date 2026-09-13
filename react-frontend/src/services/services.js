const BASE_URL = "https://traffic-accidents-project.onrender.com"

function getParams(filters) {
  const params = new URLSearchParams();

  if (filters.year) {
    params.append("year", filters.year);
  }

  if (filters.month) {
    params.append("month", filters.month);
  }

  if (filters.weekday) {
    params.append("weekday", filters.weekday);
  }

  if (filters.state) {
    params.append("search", filters.state);
  }

  if (filters.vehicleType && filters.vehicleType.length >0) {
    params.append("type", filters.vehicleType);
  }

  if (filters.injuryType && filters.injuryType.length > 0) {
    params.append("category", filters.injuryType);
  }

  if (filters.limit) {
    params.append("limit", filters.limit);
  }

  if (filters.sort) {
    params.append("sort", filters.sort);
  }

  return (params);
}

export async function getAccidents(filters) {
  
  const params = getParams(filters)
  const url = `${BASE_URL}/accidents?${params.toString()}`;

  const response = await fetch(
    url
  );

  if (!response.ok) {
    throw new Error("Failed to fetch accidents");
  }

  return response.json();
}

export async function countAccidents(filters) {
  
  const params = getParams(filters)
  const url = `${BASE_URL}/accidents/count?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch accidents");
  }

  const data = await response.json();
  return data.accidents;
}

export async function accidentsRate(filters) {

  const params = getParams(filters);
  const url = `${BASE_URL}/accidents/rate?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch accidents");
  }

  const data = await response.json();
  
  return data;
}

export async function getFirstyear(filters) {

  const params = getParams(filters);
  const url = `${BASE_URL}/accidents/first-year?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch accidents");
  }

  const data = await response.json();
  
  return data;
}

export async function getChart(filters) {

  const params = getParams(filters);
  const url = `${BASE_URL}/accidents/trend?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch accidents");
  }

  const data = await response.json();
  
  return data;
}

export async function getPopulation(filters) {

  const params = getParams(filters);
  const url = `${BASE_URL}/population?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch accidents");
  }

  const data = await response.json();
  
  return data;
}

export async function getRegion(filters) {

  const params = getParams(filters);
  const url = `${BASE_URL}/regions?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch accidents");
  }

  const data = await response.json();
  
  return data;
}

export async function getMetadata() {
  const url = `${BASE_URL}/metadata/datasets`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch metadata");
  }

  const data = await response.json();
  
  return data;

}

