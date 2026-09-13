const BASE_URL = "http://localhost:3000";

async function loadPopulation() {

    const year = document.getElementById("year").value;
    const state = document.getElementById("state").value;
    let params = new URLSearchParams();

    if(year)
        params.append("year", year);
    if(state)
        params.append("search", state)

    const response =
        await fetch(
            `${BASE_URL}/population?${params}`
        );

    const data = await response.json();
    console.log(data)

    const tbody = document.getElementById("results-body");

    tbody.innerHTML = "";

    data.forEach(row => {

        tbody.innerHTML += `
            <tr>
                <td>${row.region_name}</td>
                <td>${row.ags}</td>
                <td>${row.year}</td>
                <td>${row.population_total.toLocaleString()}</td>
            </tr>
        `;
    });

    document.getElementById("result-table").style.display = "table";
}