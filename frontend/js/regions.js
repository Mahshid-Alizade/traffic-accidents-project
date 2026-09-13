const BASE_URL = "http://localhost:3000";

async function loadRegions() {

    const q = document.getElementById("input").value.trim();

    const params = new URLSearchParams();

    if (q) {
        params.append("q", q);
    }

    const response = await fetch(
        `${BASE_URL}/regions?${params}`
    );

    const data = await response.json();

    console.log(data);

    const tbody = document.getElementById("results-body");

    tbody.innerHTML = "";

    data.forEach(row => {

        tbody.innerHTML += `
            <tr>
                <td>${row.region_name}</td>
                <td>${row.ags}</td>
            </tr>
        `;
    });

    document.getElementById("result-table").style.display = "table";
}