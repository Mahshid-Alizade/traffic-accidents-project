import "../../css/reusable/Toggle.css";

function Toggle({ id, label, options = [], value, onChange }) {
  return (
    <div className="toggle-card">
      <label htmlFor={id}>{label}</label>
      <div className="toggle">
        {options.map((option) => (
          <button
            id={id}
            type="button"
            key={option.value}
            className={`toggle-option ${value === option.value ? "active" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Toggle;
