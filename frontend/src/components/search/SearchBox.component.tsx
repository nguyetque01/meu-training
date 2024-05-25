import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

interface Props {
  onSearch: (searchTerm: string) => void;
}

const SearchBox: React.FC<Props> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          size="small"
        />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Button variant="contained" onClick={handleSearchClick}>
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default SearchBox;
