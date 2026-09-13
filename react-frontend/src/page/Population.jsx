import React from "react";
import { ACCIDENT_YEARS } from "../assets/utilitites";
import { useState, useEffect } from "react";
import PageHeader from "../component/PageHeader";
import ResultTable from "../component/ResultTable";
import "../css/FiltersCard.css";
import Select from "../component/reusable/Select";
import Input from "../component/reusable/Input";
import SubmitButton from "../component/reusable/SubmitButton";
import { getPopulation } from "../services/services";
import { prepareEntries } from "../services/entryPrepration";

export default function Population() {
  const [year, setYear] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 425);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function submitHandler() {
    try {
      const data = await getPopulation({
        year,
        state,
      });

      console.log("data produced by getPopulation", data);
      const preparedData = prepareEntries(data, "population");

      setResult({
        data: preparedData,
      });
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  }

  return (
    <div className="population-container">
      <PageHeader
        title="Population Explorer"
        subtitle="Explore population statistics by region and year."
      />
      <div className="filters-card">
        <div className="four-columns-first">
          <Select
            id="accident-year"
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={ACCIDENT_YEARS}
          />
        </div>

        <div
          className={isMobile ? "one-column" : "four-columns-second-to-forth"}
        >
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
