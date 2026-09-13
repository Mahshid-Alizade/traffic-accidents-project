const BASE_URL = "http://localhost:3000";

async function countAccidents() {

    const result_box = document.querySelector(".result-box");
    const year = document.getElementById("year").value;
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const state = document.getElementById("state").value || "";
    
    let params = new URLSearchParams();

    params.append("year",year);
    if(state) 
        params.append("search", state)
    if(category) 
        params.append("category", category)

    if(type)
        params.append("type", type);

    const response =
    await fetch(
        `${BASE_URL}/accidents/count?${params}`
    );

    const data = await response.json();
    console.log(data)
    
    if (data.accidents == 0) {

        result_box.children[0].textContent = "";
        result_box.children[1].textContent = "No Accidents Found!";

        result_box.classList.remove("succeed");
        result_box.classList.add("failed");

    } else {

        result_box.children[0].textContent =
            data.accidents;

        result_box.children[1].textContent =
            "Accidents Found";

        result_box.classList.remove("failed");
        result_box.classList.add("succeed");
}

}

async function rateAccidents() {

    let resultTable = document.getElementById("result-table");
    const year = document.getElementById("year").value;
    const type = document.getElementById("type").value;
    const sort = document.getElementById("sort").value;
    const limit = document.getElementById("limit").value;
    const category = document.getElementById("category").value;

    let params = new URLSearchParams();

    if(year)
        params.append("year", year);
    
    if(type)
        params.append("type",type);

    if(sort)
        params.append("sort", sort);

    if (limit)
        params.append("limit", limit);

    if (category)
        params.append("category", category);


    const response =
    await fetch(
        `${BASE_URL}/accidents/rate?${params}`
    );

    const data = await response.json();

    // Remove old rows except header
    while (resultTable.rows.length > 1) {
        resultTable.deleteRow(1);
    }

    data.results.forEach((item, index) => {
        const row = resultTable.insertRow();

        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = item.region_name;
        row.insertCell().textContent = item.accidents;
        row.insertCell().textContent = item.population_total.toLocaleString();
        row.insertCell().textContent = getSeverity(category);
        row.insertCell().textContent = item.accidents_per_100k;
    });

    resultTable.classList.add("active");


}

function getAccidentType(accident) {

    const types = [];

    if (accident.is_car)
        types.push("Car");

    if (accident.is_pedestrian)
        types.push("Pedestrian");

    if (accident.is_bicycle)
        types.push("Bicycle");

    if (accident.is_motorcycle)
        types.push("Motorcycle");

    return types.join(", ");
}

function getSeverity(category) {

    switch (category) {

        case 1:
        case "1":
            return "Fatal accident";

        case 2:
        case "2":
            return "Serious injury accident";

        case 3:
        case "3":
            return "Slight injury accident";

        default:
            return category;
    }
}

async function filterAccident() {

    const weekdays = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
    };

    const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
    };



    let resultTable = document.getElementById("result-table");
    const year = document.getElementById("year").value;
    const weekday = document.getElementById("weekday").value;
    const month = document.getElementById("month").value;
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const limit = document.getElementById("limit").value || "";
    const ags = document.getElementById("state").value || "";

    let params = new URLSearchParams();

    if(year)
        params.append("year", year);
    if(weekday)
        params.append("weekday", weekday);
    if(month)
        params.append("month", month);
    if(type)
        params.append("type", type);
    if(limit)
        params.append("limit", limit);
    if(ags)
        params.append("search", ags);
    if(category)
        params.append("category", category);


    const response =
    await fetch(
        `${BASE_URL}/accidents?${params}`
    );

    const data = await response.json();

    // Remove old rows except header
    while (resultTable.rows.length > 1) {
        resultTable.deleteRow(1);
    }

    data.forEach((item) => {
    const row = resultTable.insertRow();

    row.insertCell().textContent = item.accident_id;
    row.insertCell().textContent = item.year;
    row.insertCell().textContent = months[item.month];
    row.insertCell().textContent = weekdays[item.weekday];
    row.insertCell().textContent = item.hour;
    row.insertCell().textContent = getSeverity(item.category);
    row.insertCell().textContent = getAccidentType(item);
    row.insertCell().textContent = item.ags;
});

    resultTable.classList.add("active");

}

async function getFirstYear() {
    
    const result_box = document.querySelector(".result-box");
    const state = document.getElementById("state").value;

    let url =
        `${BASE_URL}/accidents/first-year`;

    if (state) {
        url += `?state=${state}`;
    }

    const response = await fetch(url);

    const data = await response.json();
    console.log(data);

    result_box.children[0].textContent = data.first_available_year;
    result_box.children[1].textContent = "The first Available data for this region was in this year";
    
    result_box.classList.add("succeed");
}