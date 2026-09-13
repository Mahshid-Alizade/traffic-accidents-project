import "../../css/reusable/SubmitButton.css";

function SubmitButton({ children = "Submit", onClick, disabled = false }) {
  return (
    <div className="one-column">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="submit-button"
      >
        {children}
      </button>
    </div>
  );
}

export default SubmitButton;
