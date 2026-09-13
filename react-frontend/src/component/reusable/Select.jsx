import "../../css/reusable/Select.css";

function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
}) {
  return (
    <div className="select-card">
      <label htmlFor={id}>{label}</label>

      <select id={id} value={value} onChange={onChange}>
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
