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

interface ProductGridProps {
  products: IProduct[];
  page: number;
  pageSize: number;
  totalProducts: number;
  searchTerm: string;
  handleClickEditBtn: (code: string) => void;
  onChangePage: (newPage: number) => void;
  onChangePageSize: (newPageSize: number) => void;
}

const ProductGrid = ({
  products,
  page,
  pageSize,
  totalProducts,
  searchTerm,
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

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Box className="grid" sx={{ p: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {highlightText(product.id.toString(), searchTerm)}
                </TableCell>
                <TableCell>{highlightText(product.code, searchTerm)}</TableCell>
                <TableCell>{highlightText(product.name, searchTerm)}</TableCell>
                <TableCell>
                  {highlightText(product.category, searchTerm)}
                </TableCell>
                <TableCell>
                  {product.brand && highlightText(product.brand, searchTerm)}
                </TableCell>
                <TableCell>
                  {product.type && highlightText(product.type, searchTerm)}
                </TableCell>
                <TableCell>
                  {product.description &&
                    highlightText(product.description, searchTerm)}
                </TableCell>
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
