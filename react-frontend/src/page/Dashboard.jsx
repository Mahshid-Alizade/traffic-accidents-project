import PageHeader from "../component/PageHeader";
import "../css/variables.css";
import "../css/pages/Dashboard.css";
import InfoCard from "../component/InfoCard";
import { getChart } from "../services/services";
import { Database, KeyRound, Earth, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import Chart from "../component/reusable/Chart";

function Dashboard() {
  const [chartData, setChartData] = useState("");

  useEffect(() => {
    async function fetchChartData() {
      try {
        const data = await getChart("");
        setChartData(data);
      } catch {
        console.error(error);
        setError("Failed to load chart data.");
      }
    }

    fetchChartData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of integrated traffic accident, population and region data for Germany."
      />
      <div className="info-section">
        <InfoCard icon={Database} boldInfo="3" subInfo="Datasets" />
        <InfoCard icon={KeyRound} boldInfo="AGS" subInfo="Integration Key" />
        <InfoCard
          icon={Earth}
          boldInfo="Germany"
          subInfo="Geographic Coverage"
        />
        <InfoCard
          icon={CalendarDays}
          boldInfo="2016-2024"
          subInfo="Accident Data Coverage"
        />
      </div>

      <div className="chart-section">
        {chartData && (
          <div>
            <p>Germany Accident Trend</p>
            <Chart data={chartData} label="Accidents" />
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
