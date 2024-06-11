import React from "react";
import { Autocomplete, TextField } from "@mui/material";

type FilterProps<T> = {
  label: string;
  allValues: T[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
};

const Filter = <T extends { id: number; name?: string; typeName?: string }>({
  label,
  allValues,
  selectedValues,
  onChange,
}: FilterProps<T>) => {
  const handleChange = (event: React.SyntheticEvent, value: T[]) => {
    onChange(value);
  };

  return (
    <div>
      <Autocomplete
        multiple
        options={allValues}
        getOptionLabel={(option) => option.name || option.typeName || ""}
        value={selectedValues}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </div>
  );
};

export default Filter;
