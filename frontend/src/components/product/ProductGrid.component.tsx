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
import { IBrand } from "../../types/brand.tying";
import { IType } from "../../types/type.tying";
import { highlightText, shouldHighlight } from "../../utils/highlight.utils";
import { capitalizeFirstLetter } from "../../utils/string.utils";
import { productColumns } from "../../constants/columns.contants";
import Filter from "../filter/Filter.component";

interface ProductGridProps {
  isLoading: boolean;
  products: IProductDto[];
  brands: IBrand[];
  types: IType[];
  page: number;
  pageSize: number;
  totalProducts: number;
  searchTerm: string;
  searchColumn: string;
  searchType: string;
  selectedBrands: IBrand[];
  selectedTypes: IType[];
  handleClickEditBtn: (code: string) => void;
  handleClickDeleteBtn: (code: string) => void;
  onChangePage: (newPage: number) => void;
  onChangePageSize: (newPageSize: number) => void;
  onSelectBrands: (brands: IBrand[]) => void;
  onSelectTypes: (types: IType[]) => void;
}

const calculateCellWidth = (field: keyof IProductDto): number => {
  switch (field) {
    case "name":
    case "description":
      return 200;
    case "code":
    case "id":
      return 50;
    default:
      return 150;
  }
};

const renderTableHeaderCells = (
  column: string,
  brands: IBrand[],
  types: IType[],
  selectedBrands: IBrand[],
  selectedTypes: IType[],
  onSelectBrands: (brands: IBrand[]) => void,
  onSelectTypes: (types: IType[]) => void
) => {
  return (
    <TableCell
      key={column}
      sx={{
        fontSize: 16,
        width: calculateCellWidth(column as keyof IProductDto),
      }}
    >
      {column === "brand" ? (
        <Filter<IBrand>
          label={capitalizeFirstLetter("brand")}
          allValues={brands}
          selectedValues={selectedBrands}
          onChange={onSelectBrands}
        />
      ) : column === "type" ? (
        <Filter<IType>
          label={capitalizeFirstLetter("type")}
          allValues={types}
          selectedValues={selectedTypes}
          onChange={onSelectTypes}
        />
      ) : (
        capitalizeFirstLetter(column)
      )}
    </TableCell>
  );
};

const renderTableCell = (
  product: IProductDto,
  field: keyof IProductDto,
  searchTerm: string,
  searchType: string,
  searchColumn: string
) => {
  let productField;
  if (field === "brand" || field === "type") {
    productField = product[field]?.name;
  } else {
    productField = product[field];
  }
  const matchField =
    product.searchMatches[field as keyof IProductDto["searchMatches"]];

  return (
    <TableCell key={field} sx={{ width: calculateCellWidth(field) }}>
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
  brands,
  types,
  selectedBrands,
  selectedTypes,
  handleClickEditBtn,
  handleClickDeleteBtn,
  onChangePage,
  onChangePageSize,
  onSelectBrands,
  onSelectTypes,
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
              {productColumns.map((column) =>
                renderTableHeaderCells(
                  column,
                  brands,
                  types,
                  selectedBrands,
                  selectedTypes,
                  onSelectBrands,
                  onSelectTypes
                )
              )}
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
