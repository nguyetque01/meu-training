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
import { IProductDto } from "../../types/product.tying";
import { highlightText, shouldHighlight } from "../../utils/highlight.utils";
import { capitalizeFirstLetter } from "../../utils/string.utils";
import { productColumns } from "../../constants/product.contants";

interface ProductGridProps {
  products: IProductDto[];
  page: number;
  pageSize: number;
  totalProducts: number;
  searchTerm: string;
  searchColumn: string;
  searchType: string;
  handleClickEditBtn: (code: string) => void;
  handleClickDeleteBtn: (code: string) => void;
  onChangePage: (newPage: number) => void;
  onChangePageSize: (newPageSize: number) => void;
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
  products,
  page,
  pageSize,
  totalProducts,
  searchTerm,
  searchColumn,
  searchType,
  handleClickEditBtn,
  handleClickDeleteBtn,
  onChangePage,
  onChangePageSize,
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
                <TableCell key={column}>
                  {capitalizeFirstLetter(column)}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
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
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductGrid;
