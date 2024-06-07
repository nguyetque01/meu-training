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
  TablePagination,
  TableRow,
} from "@mui/material";
import { IBrand } from "../../types/brand.tying";
import {
  highlightText,
  shouldHighlightBrand,
} from "../../utils/highlight.utils";
import { capitalizeFirstLetter } from "../../utils/string.utils";
import { brandColumns } from "../../constants/columns.contants";

interface BrandGridProps {
  brands: IBrand[];
  page: number;
  pageSize: number;
  totalBrands: number;
  searchTerm: string;
  searchColumn: string;
  searchType: string;
  handleClickEditBtn: (id: number) => void;
  handleClickDeleteBtn: (id: number) => void;
  onChangePage: (newPage: number) => void;
  onChangePageSize: (newPageSize: number) => void;
}

const renderTableCell = (
  brand: IBrand,
  field: keyof IBrand,
  searchTerm: string,
  searchType: string,
  searchColumn: string
) => {
  const brandField = brand[field];
  const matchField =
    brand.searchMatches[field as keyof IBrand["searchMatches"]];

  return (
    <TableCell key={field}>
      {brandField &&
        (shouldHighlightBrand(brand, field as string, searchColumn) &&
        matchField
          ? highlightText(
              brandField.toString(),
              matchField as number[],
              searchTerm,
              searchType
            )
          : brandField.toString())}
    </TableCell>
  );
};

const BrandGrid = ({
  brands,
  page,
  pageSize,
  totalBrands,
  searchTerm,
  searchColumn,
  searchType,
  handleClickEditBtn,
  handleClickDeleteBtn,
  onChangePage,
  onChangePageSize,
}: BrandGridProps) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    onChangePage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChangePageSize(parseInt(event.target.value, 10));
    onChangePage(1);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {brandColumns.map((column) => (
                <TableCell key={column}>
                  {capitalizeFirstLetter(column)}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands?.map((brand: IBrand) => (
              <TableRow key={brand.id}>
                {brandColumns.map((field) =>
                  renderTableCell(
                    brand,
                    field as keyof IBrand,
                    searchTerm,
                    searchType,
                    searchColumn
                  )
                )}
                <TableCell width={100}>
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
                      onClick={() => handleClickEditBtn(brand.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      aria-label="delete"
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleClickDeleteBtn(brand.id)}
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
                count={totalBrands}
                rowsPerPage={pageSize}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BrandGrid;
