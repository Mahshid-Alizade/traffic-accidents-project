import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../../css/reusable/Chart.css";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function Chart({ data = [], label = "Accidents" }) {
  if (data.length === 0) {
    return null;
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 440);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 440);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chartData = data.map((item) => ({
    year: item.year,
    accidents: Number(item.accidents),
  }));

  return (
    <motion.div
      key={chartData}
      initial={{ opacity: 0, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="chart-container one-column"
    >
      <ResponsiveContainer width="100%">
        <LineChart
          data={chartData}
          margin={{
            right: 10,
            left: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="year"
            tick={isMobile ? false : undefined}
            height={isMobile ? 10 : undefined}
          />

          <YAxis
            width={isMobile ? 10 : undefined}
            domain={
              isMobile
                ? [(dataMin) => dataMin * 0.95, (dataMax) => dataMax * 1.05]
                : [0, (dataMax) => Math.ceil((dataMax * 1.5) / 500) * 500]
            }
            tick={isMobile ? false : undefined}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="accidents"
            name={label}
            stroke="#b51c1c"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default Chart;
