import React from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Typography,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TablePagination,
} from "@mui/material";
import { IProductDto } from "../../types/product.tying";
import { highlightText, shouldHighlight } from "../../utils/highlight.utils";
import { capitalizeFirstLetter } from "../../utils/string.utils";
import { productColumns } from "../../constants/columns.contants";

interface ProductGridProps {
  isLoading: boolean;
  products: IProductDto[];
  page: number;
  pageSize: number;
  totalProducts: number;
  searchTerm: string;
  searchColumn: string;
  searchType: string;
  brandNames: string[];
  typeNames: string[];
  selectedBrands: string[];
  selectedTypes: string[];
  handleClickEditBtn: (code: string) => void;
  handleClickDeleteBtn: (code: string) => void;
  onChangePage: (newPage: number) => void;
  onChangePageSize: (newPageSize: number) => void;
  onFilterChange: (column: string, values: string[]) => void;
}

const renderTableCell = (
  product: IProductDto,
  field: keyof IProductDto,
  searchTerm: string,
  searchType: string,
  searchColumn: string
) => {
  const productField = product[field];
  const matchField =
    product.searchMatches[field as keyof IProductDto["searchMatches"]];

  return (
    <TableCell key={field}>
      {productField &&
        (shouldHighlight(product, field as string, searchColumn) && matchField
          ? highlightText(
              productField.toString(),
              matchField as number[],
              searchTerm,
              searchType
            )
          : productField.toString())}
    </TableCell>
  );
};

const ProductGrid = ({
  isLoading,
  products,
  page,
  pageSize,
  totalProducts,
  searchTerm,
  searchColumn,
  searchType,
  brandNames,
  typeNames,
  selectedBrands,
  selectedTypes,
  handleClickEditBtn,
  handleClickDeleteBtn,
  onChangePage,
  onChangePageSize,
  onFilterChange,
}: ProductGridProps) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    onChangePage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChangePageSize(parseInt(event.target.value, 10));
    onChangePage(1);
  };

  const handleMultiSelectChange = (
    event: SelectChangeEvent<string[]>,
    columnName: string,
    selectedValues: string[],
    allValues: string[]
  ) => {
    const { value } = event.target;
    const newValue = typeof value === "string" ? value.split(",") : value;
    const allSelected = newValue.includes("All");
    const updatedValues = allSelected
      ? selectedValues.length === allValues.length
        ? []
        : allValues
      : newValue;

    onFilterChange(columnName, updatedValues);
  };

  const handleBrandChange = (event: SelectChangeEvent<string[]>) => {
    handleMultiSelectChange(event, "brand", selectedBrands, brandNames);
  };

  const handleTypeChange = (event: SelectChangeEvent<string[]>) => {
    handleMultiSelectChange(event, "type", selectedTypes, typeNames);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <>
      <Box className="grid" sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {productColumns.map((column) => (
                  <TableCell key={column} sx={{ fontSize: 16 }}>
                    {column === "brand" ? (
                      <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                        <InputLabel id="brand-select-label">Brands</InputLabel>
                        <Select
                          labelId="brand-select-label"
                          multiple
                          value={selectedBrands}
                          onChange={handleBrandChange}
                          input={<OutlinedInput label="Brands" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="All">
                            <Checkbox
                              checked={
                                selectedBrands.length === brandNames.length
                              }
                            />
                            <ListItemText primary="All Brands" />
                          </MenuItem>
                          {brandNames.map((brand) => (
                            <MenuItem key={brand} value={brand}>
                              <Checkbox
                                checked={selectedBrands.indexOf(brand) > -1}
                              />
                              <ListItemText primary={brand} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : column === "type" ? (
                      <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                        <InputLabel id="type-select-label">Types</InputLabel>
                        <Select
                          labelId="type-select-label"
                          multiple
                          value={selectedTypes}
                          onChange={handleTypeChange}
                          input={<OutlinedInput label="Types" />}
                          renderValue={(selected) => selected.join(", ")}
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="All">
                            <Checkbox
                              checked={
                                selectedTypes.length === typeNames.length
                              }
                            />
                            <ListItemText primary="All Types" />
                          </MenuItem>
                          {typeNames.map((type) => (
                            <MenuItem key={type} value={type}>
                              <Checkbox
                                checked={selectedTypes.indexOf(type) > -1}
                              />
                              <ListItemText primary={type} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      capitalizeFirstLetter(column)
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ fontSize: 16 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            {!isLoading && products?.length !== 0 && (
              <>
                <TableBody>
                  {products?.map((product: IProductDto) => (
                    <TableRow key={product.id}>
                      {productColumns.map((field) =>
                        renderTableCell(
                          product,
                          field as keyof IProductDto,
                          searchTerm,
                          searchType,
                          searchColumn
                        )
                      )}
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            aria-label="edit"
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            onClick={() => handleClickEditBtn(product.code)}
                          >
                            Edit
                          </Button>
                          <Button
                            aria-label="delete"
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleClickDeleteBtn(product.code)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      count={totalProducts}
                      rowsPerPage={pageSize}
                      page={page - 1}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </>
            )}
          </Table>
        </TableContainer>
        {isLoading ? (
          <Box sx={{ p: 2, textAlign: "center", mt: 2 }}>
            <CircularProgress size={100} />
          </Box>
        ) : (
          products?.length === 0 && (
            <Box sx={{ p: 2, textAlign: "center", mt: 2 }}>
              <Typography variant="h5">Not found</Typography>
            </Box>
          )
        )}
      </Box>
    </>
  );
};

export default ProductGrid;
