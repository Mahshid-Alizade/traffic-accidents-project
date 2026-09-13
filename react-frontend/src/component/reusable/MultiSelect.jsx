import { useEffect, useRef, useState } from "react";
import "../../css/reusable/MultiSelect.css";

function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Reference to the whole MultiSelect component
  const multiSelectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        multiSelectRef.current &&
        !multiSelectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allSelected = options.length > 0 && value.length === options.length;

  const toggleOption = (option) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];

    onChange(newValue);
  };

  const toggleAll = () => {
    onChange(allSelected ? [] : options);
  };

  const removeOption = (option) => {
    onChange(value.filter((item) => item !== option));
  };

  return (
    <div className="multi-select" ref={multiSelectRef}>
      {label && <label className="multi-select-label">{label}</label>}

      {/* Select box */}
      <div className="select-box" onClick={() => setIsOpen((prev) => !prev)}>
        <span className="arrow">▾</span>

        {value.length === 0 ? (
          <span className="placeholder">{placeholder}</span>
        ) : (
          <div className="tags">
            {value.map((item) => (
              <span className="tag" key={item}>
                {item}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(item);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="dropdown">
          {/* Select All */}
          <label className="option">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />

            <span>All</span>
          </label>

          {/* Options */}
          {options.map((option) => (
            <label className="option" key={option}>
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggleOption(option)}
              />

              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
