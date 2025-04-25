import React from "react";

const MultiSelect = ({
  options,
  value,
  onChange,
  label,
  idKey = "id", // Default to "id"
  labelKey = "label", // Default to "label"
}) => {
  // Handle multi-select change
  const handleChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    onChange(selectedValues); // Update the parent state with selected values
  };

  return (
    <div className="input-group w-1/5 ">
      <label htmlFor="multi-select" className="block">
        {label}
      </label>
      <select
        id="multi-select"
        name="multi-select"
        multiple
        value={value}
        onChange={handleChange}
        className="form-control w-full p-2 border border-red-300 rounded"
      >
        {options.map((option) => (
          <option key={option[idKey]} value={String(option[idKey])}>
            {option[labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MultiSelect;
