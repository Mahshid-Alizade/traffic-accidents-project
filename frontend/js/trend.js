const BASE_URL = "http://localhost:3000";

let trendChart = null;

async function drawTrendChart() {

    const state =
        document.getElementById("state").value;

    let url =
        `${BASE_URL}/accidents/trend`;

    if (state) {
        url += `?search=${state}`;
    }

    const response =
        await fetch(url);

    const data =
        await response.json();

    const labels =
        data.map(item => item.year);

    const values =
        data.map(item =>
            Number(item.accidents)
        );

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(
        document.getElementById("trendChart"),
        {
            type: "line",

            data: {
                labels: labels,

                datasets: [{
                    label: "Accidents",
                    data: values
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: true,
                devicePixelRatio: window.devicePixelRatio
            }
        }
    );
}