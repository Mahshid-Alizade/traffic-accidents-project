import "../../css/reusable/Input.css";

function Input({ id, type, label, value, onChange, placeholder, min, max }) {
  return (
    <div className="input-card">
      <label htmlFor={id}>{label}</label>
      <input
        className="input"
        type={type}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        min={min}
        max={max}
      />
    </div>
  );
}

export default Input;
