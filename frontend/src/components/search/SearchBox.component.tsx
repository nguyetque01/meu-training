import React, { useState } from "react";
import {
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { productColumns } from "../../constants/columns.contants";
import { capitalizeFirstLetter } from "../../utils/string.utils";
import { useDebounce } from "../../hooks/debounce";

interface ISearchBoxProps {
  columns: string[];
  onSearch: (
    searchTerm: string,
    searchColumn: string,
    searchType: string
  ) => void;
}

const SearchBox: React.FC<ISearchBoxProps> = ({ columns, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");
  const [searchType, setSearchType] = useState<string>("partial");

  const debouncedOnSearch = useDebounce(onSearch, 2000);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedOnSearch(value, searchColumn, searchType);
  };

  const handleColumnChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSearchColumn(value as string);
    onSearch(searchTerm, value, searchType);
  };
  const handleSearchTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSearchType(value as string);
    onSearch(searchTerm, searchColumn, value);
  };

  return (
    <Box display="flex" alignItems="center">
      <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
        <InputLabel>Column</InputLabel>
        <Select
          value={searchColumn}
          onChange={handleColumnChange}
          label="Column"
        >
          <MenuItem value="all">All</MenuItem>
          {columns.map((column) => (
            <MenuItem key={column} value={column}>
              {capitalizeFirstLetter(column)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mr: 2, width: "100%" }}
      />

      <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
        <InputLabel>Search Type</InputLabel>
        <Select
          value={searchType}
          onChange={handleSearchTypeChange}
          label="Search Type"
        >
          <MenuItem value="partial">Partial</MenuItem>
          <MenuItem value="exact">Exact</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchBox;
