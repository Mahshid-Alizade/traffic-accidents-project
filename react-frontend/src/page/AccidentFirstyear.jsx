import React from "react";
import { STATES } from "../assets/utilitites";
import Select from "../component/reusable/Select";
import SubmitButton from "../component/reusable/SubmitButton";
import PageHeader from "../component/PageHeader";
import ResultCard from "../component/ResultCard";
import { getFirstyear } from "../services/services";
import { useState } from "react";
import "../css/FiltersCard.css";

export default function AccidentFirstyear() {
  const [state, setState] = useState("");
  const [result, setResult] = useState(null);

  async function submitHandler() {
    try {
      const data = await getFirstyear({
        state,
      });

      setResult({
        year: data.first_available_year,
        description: state
          ? `Earliest available accident data for ${STATES.find((item) => item.value === state)?.label}`
          : "Earliest available accident data for all states",
        status: "success",
        title: "First Available Year",
      });
    } catch (error) {
      console.error(error);
      setResult({
        year: "No data is available!",
        description: "",
        status: "error",
        title: "",
      });
    }
  }

  return (
    <div className="accident-firstyear-container">
      <PageHeader
        title="First Year of Information"
        subtitle="Shows the earliest year for which accident data is available."
      />
      <div className="filters-card">
        <div className="one-column">
          <Select
            id="state"
            label="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            options={STATES}
            placeholder="All States"
          />
        </div>
        <SubmitButton onClick={submitHandler}>Apply Filters</SubmitButton>
        {result && (
          <ResultCard
            resultTitle={result.title}
            resultCount={result.year}
            resultDescription={result.description}
            status={result.status}
          />
        )}
      </div>
    </div>
  );
}
