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
import { IProduct } from "../../types/product.tying";
import { highlightText, shouldHighlight } from "../../utils/highlight.utils";
import { capitalizeFirstLetter } from "../../utils/string.utils";
import { productColumns } from "../../constants/product.contants";

interface ProductGridProps {
  products: IProduct[];
  page: number;
  pageSize: number;
  totalProducts: number;
  searchTerm: string;
  searchColumn: string;
  searchType: string;
  handleClickEditBtn: (code: string) => void;
  onChangePage: (newPage: number) => void;
  onChangePageSize: (newPageSize: number) => void;
}

const renderTableCell = (
  product: IProduct,
  field: keyof IProduct,
  searchTerm: string,
  searchType: string,
  searchColumn: string
) => {
  const productField = product[field];
  const matchField =
    product.searchMatches[field as keyof IProduct["searchMatches"]];

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
            {products?.map((product: IProduct) => (
              <TableRow key={product.id}>
                {productColumns.map((field) =>
                  renderTableCell(
                    product,
                    field as keyof IProduct,
                    searchTerm,
                    searchType,
                    searchColumn
                  )
                )}
                <TableCell>
                  <Button
                    aria-label="edit"
                    size="small"
                    color="secondary"
                    onClick={() => handleClickEditBtn(product.code)}
                  >
                    Edit
                  </Button>
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
