import { useState } from "react";
import PageHeader from "../component/PageHeader";
import "../css/FiltersCard.css";
import Select from "../component/reusable/Select";
import Input from "../component/reusable/Input";
import MultiSelect from "../component/reusable/MultiSelect";
import SubmitButton from "../component/reusable/SubmitButton";
import ResultCard from "../component/ResultCard";
import ResultTable from "../component/ResultTable";
import { countAccidents } from "../services/services";
import { ACCIDENT_YEARS, getMonths, getWeekdays } from "../assets/utilitites";
import { data } from "react-router-dom";

function AccidentCounter() {
  const [year, setYear] = useState("");
  const [state, setState] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [result, setResult] = useState(null);

  async function submitHandler() {
    try {
      const accidetnsCount = await countAccidents({
        year,
        state,
        vehicleType,
        injuryType,
      });

      console.log("data produced by getAccidents", accidetnsCount);

      setResult({
        resultTitle: "Total Accidents",
        resultCount: accidetnsCount,
        resultDescription: "matching selected filters",
        status: "success",
      });
    } catch (error) {
      setResult({
        resultTitle: "Error",
        resultCount: "!",
        resultDescription: "Failed to retrieve accident data",
        status: "error",
      });
    }
  }
  return (
    <div className="accident-counter-container">
      <PageHeader
        title="Accident Counter"
        subtitle="Count accidents using different filters."
      />

      <div className="filters-card">
        <Select
          id="accident-year"
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          options={ACCIDENT_YEARS}
        />

        <Input
          id="accident-text-input"
          label="State"
          value={state}
          type="text"
          onChange={(e) => setState(e.target.value)}
          placeholder="This can be the exact AGS region code or Federal state code (first two digits of AGS)."
        />

        <MultiSelect
          label="Vehicle Type"
          options={["Bicycle", "Car", "Pedestrian", "Motorcycle"]}
          value={vehicleType}
          onChange={setVehicleType}
        />

        <MultiSelect
          label="Injury Type"
          options={["Fatal Accidents", "Serious Injury", "Slight Injury"]}
          value={injuryType}
          onChange={setInjuryType}
        />

        <SubmitButton onClick={submitHandler}>Apply Filters</SubmitButton>

        {result && (
          <ResultCard
            resultTitle={result.resultTitle}
            resultCount={result.resultCount}
            resultDescription={result.resultDescription}
            status={result.status}
          />
        )}
      </div>
    </div>
  );
}

export default AccidentCounter;
