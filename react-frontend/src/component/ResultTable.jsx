import "../css/ResultTable.css";
import ResultCard from "./ResultCard";
import { AnimatePresence, motion } from "motion/react";

function ResultTable({ data }) {
  if (!data || data.length === 0) {
    // return <p>No results found.</p>;
    return (
      <ResultCard
        resultTitle="with the given entries"
        resultCount="No data is available!"
        resultDescription=""
        status="error"
      />
    );
  }

  return (
    <motion.div
      key={JSON.stringify(data)}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="result-table-container one-column"
    >
      <table className="result-table">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.accident_id ?? index}>
              {Object.entries(entry).map(([key, value]) => (
                <td key={key}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default ResultTable;
