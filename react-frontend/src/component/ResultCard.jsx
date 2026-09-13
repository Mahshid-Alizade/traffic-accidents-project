import "../css/ResultCard.css";
import { AnimatePresence, motion } from "motion/react";

function ResultCard({ resultTitle, resultCount, resultDescription, status }) {
  return (
    <motion.div
      key={resultCount}
      initial={{ opacity: 0, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className={`result-card ${status} one-column`}
    >
      <h3 className="result-title">{resultTitle}</h3>
      <div className="result-count">{resultCount}</div>
      <p className="result-description">{resultDescription}</p>
    </motion.div>
  );
}

export default ResultCard;
