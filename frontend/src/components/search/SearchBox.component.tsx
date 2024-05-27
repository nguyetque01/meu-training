import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface ISearchBoxProps {
  onSearch: (searchTerm: string, searchColumn: string) => void;
}

const SearchBox: React.FC<ISearchBoxProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleColumnChange = (event: SelectChangeEvent<string>) => {
    setSearchColumn(event.target.value as string);
  };

  const handleSearch = () => {
    onSearch(searchTerm, searchColumn);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <FormControl variant="outlined" sx={{ minWidth: 220, mr: 2 }}>
        <InputLabel>Column</InputLabel>
        <Select
          value={searchColumn}
          onChange={handleColumnChange}
          label="Column"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="id">ID</MenuItem>
          <MenuItem value="code">Code</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="category">Category</MenuItem>
          <MenuItem value="brand">Brand</MenuItem>
          <MenuItem value="type">Type</MenuItem>
          <MenuItem value="description">Description</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        variant="outlined"
        sx={{ mr: 2, width: "100%" }}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBox;
