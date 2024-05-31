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
  searchColumn: string;
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
  searchColumn,
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

  const highlightText = (text: string, matches: number[]) => {
    if (!matches || matches.length === 0) {
      return text;
    }

    let highlightedText = text;
    const words = highlightedText.split(" ");

    matches.forEach((index) => {
      let start = 0;
      if (index > 0) {
        for (let i = 0; i < index; i++) {
          start += words[i].length + 1;
        }
      }

      const end = start + searchTerm.length;

      if (start >= 0 && start < end && end <= text.length) {
        const word = text.substring(start, end);
        const regexp = new RegExp(word, "g");
        highlightedText = highlightedText.replace(
          regexp,
          `<span style="background-color: yellow;">${word}</span>`
        );
      }
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const shouldHighlight = (column: string) => {
    return searchColumn === "all" || searchColumn === column;
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
                  {shouldHighlight("id") && product.searchMatches.Id
                    ? highlightText(
                        product.id.toString(),
                        product.searchMatches.Id
                      )
                    : product.id.toString()}
                </TableCell>
                <TableCell>
                  {shouldHighlight("code") && product.searchMatches.Code
                    ? highlightText(product.code, product.searchMatches.Code)
                    : product.code}
                </TableCell>
                <TableCell>
                  {shouldHighlight("name") && product.searchMatches.Name
                    ? highlightText(product.name, product.searchMatches.Name)
                    : product.name}
                </TableCell>
                <TableCell>
                  {shouldHighlight("category") && product.searchMatches.Category
                    ? highlightText(
                        product.category,
                        product.searchMatches.Category
                      )
                    : product.category}
                </TableCell>
                <TableCell>
                  {product.brand &&
                    (shouldHighlight("brand") && product.searchMatches.Brand
                      ? highlightText(
                          product.brand,
                          product.searchMatches.Brand
                        )
                      : product.brand)}
                </TableCell>
                <TableCell>
                  {product.type &&
                    (shouldHighlight("type") && product.searchMatches.Type
                      ? highlightText(product.type, product.searchMatches.Type)
                      : product.type)}
                </TableCell>
                <TableCell>
                  {product.description &&
                    (shouldHighlight("description") &&
                    product.searchMatches.Description
                      ? highlightText(
                          product.description,
                          product.searchMatches.Description
                        )
                      : product.description)}
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
