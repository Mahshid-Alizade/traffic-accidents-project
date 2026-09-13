import React from "react";
import { useState } from "react";
import PageHeader from "../component/PageHeader";
import Input from "../component/reusable/Input";
import SubmitButton from "../component/reusable/SubmitButton";
import ResultTable from "../component/ResultTable";
import { getRegion } from "../services/services";
import { prepareEntries } from "../services/entryPrepration";

export default function Region() {
  const [year, setYear] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState(null);

  async function submitHandler() {
    try {
      const data = await getRegion({
        state,
      });

      const preparedData = prepareEntries(data, "region");

      setResult({
        data: preparedData,
      });
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  }

  return (
    <div className="region-container">
      <PageHeader
        title="Region Explorer"
        subtitle="Browse regions and AGS codes by state."
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
        <SubmitButton onClick={submitHandler}>Apply Filters</SubmitButton>
        {result && <ResultTable data={result.data} />}
      </div>
    </div>
  );
}
