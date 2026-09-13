import PageHeader from "../component/PageHeader";
import Select from "../component/reusable/Select";
import MultiSelect from "../component/reusable/MultiSelect";
import Toggle from "../component/reusable/Toggle";
import SubmitButton from "../component/reusable/SubmitButton";
import ResultTable from "../component/ResultTable";
import Input from "../component/reusable/Input";
import { useState } from "react";
import { ACCIDENT_YEARS, getMonths, getWeekdays } from "../assets/utilitites";
import { accidentsRate } from "../services/services";
import { prepareEntries } from "../services/entryPrepration";
import "../css/FiltersCard.css";

function AccidentRate() {
  const SORT_OPTIONS = [
    { value: "lowest", label: "Lowest" },
    { value: "highest", label: "Highest" },
  ];

  const [sort, setSort] = useState("highest");
  const [year, setYear] = useState("");
  const [limit, setLimit] = useState(5);

  const [vehicleType, setVehicleType] = useState("");
  const [injuryType, setInjuryType] = useState("");

  const [result, setResult] = useState(null);

  async function submitHandler() {
    try {
      const data = await accidentsRate({
        year,
        vehicleType,
        injuryType,
        limit,
        sort,
      });

      const preparedData = prepareEntries(data, "rate");

      setResult(preparedData);
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  }

  return (
    <div className="accident-rate-container">
      <PageHeader
        title="Accident Rate"
        subtitle="Computes accident rates for German districts by combining accident records, regional information, and population data."
      />
      <div className="filters-card">
        <Select
          id="accident-year"
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          options={ACCIDENT_YEARS}
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

        <Toggle
          id="accident-rate-sort"
          label="sort"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />
        <Input
          id="accident-number-input"
          label="limit"
          value={limit}
          type="number"
          min={0}
          max={100}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Number of records to display."
        />

        <SubmitButton onClick={submitHandler}>Calculate Rates</SubmitButton>

        {result && <ResultTable data={result} />}
      </div>
    </div>
  );
}

export default AccidentRate;
