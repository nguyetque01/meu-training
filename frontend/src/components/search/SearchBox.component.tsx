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
import { Debounce } from "../../utils/debounce";
import { productColumns } from "../../constants/product.contants";
import { capitalizeFirstLetter } from "../../utils/string.utils";

interface ISearchBoxProps {
  onSearch: (
    searchTerm: string,
    searchColumn: string,
    searchType: string
  ) => void;
}

const SearchBox: React.FC<ISearchBoxProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");
  const [searchType, setSearchType] = useState<string>("partial");

  Debounce(() => {
    onSearch(searchTerm, searchColumn, searchType);
  }, 2000);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value as string);
  };
  const handleSearchTypeChange = (event: SelectChangeEvent<string>) => {
    setSearchType(event.target.value as string);
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
          {productColumns.map((column) => (
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
