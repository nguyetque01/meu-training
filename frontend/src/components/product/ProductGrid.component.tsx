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
  CircularProgress,
  Typography,
  TablePagination,
} from "@mui/material";
import { IProductDto } from "../../types/product.tying";
import { highlightText, shouldHighlight } from "../../utils/highlight.utils";
import { capitalizeFirstLetter } from "../../utils/string.utils";
import { productColumns } from "../../constants/columns.contants";
import Filter from "../filter/Filter.component";

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
    <TableCell key={field} sx={{ width: field === "name" ? 200 : 150 }}>
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

  return (
    <Box className="grid" sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {productColumns.map((column) => (
                <TableCell
                  key={column}
                  sx={{ fontSize: 16, width: column === "name" ? 200 : 150 }}
                >
                  {column === "brand" || column === "type" ? (
                    <Filter
                      label={capitalizeFirstLetter(column)}
                      columnName={column}
                      allValues={column === "brand" ? brandNames : typeNames}
                      selectedValues={
                        column === "brand" ? selectedBrands : selectedTypes
                      }
                      onChange={onFilterChange}
                    />
                  ) : (
                    capitalizeFirstLetter(column)
                  )}
                </TableCell>
              ))}
              <TableCell sx={{ fontSize: 16, width: 150 }}>Actions</TableCell>
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
                    <TableCell sx={{ width: 150 }}>
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
  );
};

export default ProductGrid;
