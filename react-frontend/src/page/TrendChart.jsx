import { useState } from "react";

import { getChart } from "../services/services";

import Input from "../component/reusable/Input";
import SubmitButton from "../component/reusable/SubmitButton";
import PageHeader from "../component/PageHeader";
import Chart from "../component/reusable/Chart";

import "../css/reusable/Chart.css";
// import "../css/AccidentTrendChart.css";

export default function TrendChart() {
  const [state, setState] = useState("");
  const [chartData, setChartData] = useState([]);

  async function submitHandler() {
    try {
      const data = await getChart({
        state,
      });

      console.log("data produced by getChart", data);

      setChartData(data);
    } catch (error) {
      console.error(error);

      setChartData([]);
    }
  }

  return (
    <div className="accident-trendchart-container">
      <PageHeader
        title="Accident Trend Analysis"
        subtitle="Visualize accident counts over time."
      />

      <div className="filters-card">
        <div className="one-column">
          <Input
            id="accident-text-input"
            label="State"
            value={state}
            type="text"
            onChange={(e) => setState(e.target.value)}
            placeholder="This can be the exact AGS region code or Federal state code (first two digits of AGS)."
          />
        </div>

        <SubmitButton onClick={submitHandler}>Show Trend</SubmitButton>
        {chartData.length > 0 && <Chart data={chartData} label="Accidents" />}
      </div>
    </div>
  );
}
