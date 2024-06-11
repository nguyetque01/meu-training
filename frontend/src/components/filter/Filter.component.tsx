import React from "react";
import { FormControl, TextField, Checkbox, Autocomplete } from "@mui/material";

interface FilterProps {
  label: string;
  columnName: string;
  allValues: string[];
  selectedValues: string[];
  onChange: (columnName: string, values: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({
  label,
  columnName,
  allValues,
  selectedValues,
  onChange,
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: string[]) => {
    onChange(columnName, newValue);
  };

  return (
    <FormControl sx={{ width: 250 }}>
      <Autocomplete
        multiple
        options={allValues}
        value={selectedValues}
        onChange={handleChange}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={`Select ${label}`}
          />
        )}
      />
    </FormControl>
  );
};

export default Filter;
