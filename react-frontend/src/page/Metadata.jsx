import React, { useEffect, useState } from "react";
import PageHeader from "../component/PageHeader";
import MetadataCard from "../component/MetadataCard";
import { getMetadata } from "../services/services";
import Select from "../component/reusable/Select";

export default function Metadata() {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState("");

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const data = await getMetadata();
        setMetadata(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load metadata.");
      }
    }

    fetchMetadata();
  }, []);

  if (!metadata) {
    return <p>Loading...</p>;
  }

  const datasets = [
    { value: "accidents", label: "Traffic Accidents" },
    { value: "regions", label: "Administrative Regions" },
    { value: "population", label: "Population Statistics" },
  ];

  return (
    <div className="metadata-container">
      <PageHeader
        title="Dataset Metadata"
        subtitle="Information about all datasets used in the project."
      />
      <div className="filters-card">
        <div className="one-column">
          <Select
            id="dataset-name"
            label=""
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            options={datasets}
            placeholder="Select a dataset"
          />
          {selectedDataset && (
            <MetadataCard params={metadata[selectedDataset]} />
          )}
        </div>
      </div>
    </div>
  );
}
