import "../css/MetadataCard.css";
import { motion } from "motion/react";
export default function MetadataCard({ params }) {
  return (
    <motion.div
      key={params.table}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
    >
      <p className="metadata-summary">{params.summary}</p>

      <div className="metadata-section">
        <h3>Dataset Information</h3>

        <div className="metadata-row">
          <span>Table</span>
          <span>{params.table}</span>
        </div>

        <div className="metadata-row">
          <span>Primary Key</span>
          <span>
            {Array.isArray(params.primaryKey)
              ? params.primaryKey.join(", ")
              : params.primaryKey}
          </span>
        </div>

        {params.coverage && (
          <div className="metadata-row">
            <span>Coverage</span>
            <span>
              {params.coverage.from} – {params.coverage.to}
            </span>
          </div>
        )}

        {params.reference && (
          <div className="metadata-row">
            <span>Reference</span>
            <span>{params.reference}</span>
          </div>
        )}
      </div>

      <div className="metadata-section">
        <h3>Source</h3>

        <div className="metadata-row">
          <span>Title</span>
          <span>{params.source.title}</span>
        </div>

        <div className="metadata-row">
          <span>Organisation</span>
          <span>{params.source.organisation}</span>
        </div>

        <div className="metadata-row">
          <span>Portal</span>
          <span>{params.source.portal}</span>
        </div>

        <div className="metadata-row">
          <span>Website</span>
          <a href={params.source.url} target="_blank" rel="noreferrer">
            Visit source
          </a>
        </div>
      </div>

      <div className="metadata-section">
        <h3>Licence</h3>

        <div className="metadata-row">
          <span>Licence</span>
          <span>{params.licence}</span>
        </div>

        <div className="metadata-row">
          <span>Licence URL</span>
          <a href={params.licenceUrl} target="_blank" rel="noreferrer">
            View licence
          </a>
        </div>
      </div>

      {params.notes?.length > 0 && (
        <div className="metadata-section">
          <h3>Notes</h3>

          <ul className="metadata-notes">
            {params.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
