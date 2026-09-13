import { useState } from "react";
import PageHeader from "../component/PageHeader";
import "../css/FiltersCard.css";
import Select from "../component/reusable/Select";
import Input from "../component/reusable/Input";
import MultiSelect from "../component/reusable/MultiSelect";
import SubmitButton from "../component/reusable/SubmitButton";
import ResultTable from "../component/ResultTable";
import { prepareEntries } from "../services/entryPrepration";
import { getAccidents } from "../services/services";
import { ACCIDENT_YEARS, getMonths, getWeekdays } from "../assets/utilitites";
import { data } from "react-router-dom";

function AccidentExplorer() {
  const [year, setYear] = useState("");

  const [month, setMonth] = useState("");
  const months = getMonths();

  const [weekday, setWeekday] = useState("");
  const weekdays = getWeekdays();

  const [state, setState] = useState("");

  const [limit, setLimit] = useState(5);

  const [vehicleType, setVehicleType] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [result, setResult] = useState(null);

  async function submitHandler() {
    try {
      const data = await getAccidents({
        year,
        month,
        weekday,
        state,
        vehicleType,
        injuryType,
        limit,
      });

      console.log("data produced by getAccidents", data);
      const preparedData = prepareEntries(data, "explorer");

      setResult({
        data: preparedData,
      });
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  }

  return (
    <div className="accident-explorer-container">
      <PageHeader
        title="Accident Explorer"
        subtitle="Explore traffic accident data using interactive filters and detailed insights"
      />
      <div className="filters-card">
        <Select
          id="accident-year"
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          options={ACCIDENT_YEARS}
        />

        <Select
          id="accident-month"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={months}
          placeholder="Select a month"
        />

        <Select
          id="accident-weekday"
          label="Weekday"
          value={weekday}
          onChange={(e) => setWeekday(e.target.value)}
          options={weekdays}
          placeholder="Select a Weekday"
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

        <SubmitButton onClick={submitHandler}>Apply Filters</SubmitButton>

        {result && <ResultTable data={result.data} />}
      </div>
    </div>
  );
}

export default AccidentExplorer;
