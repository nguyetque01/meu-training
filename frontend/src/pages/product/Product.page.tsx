import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { IProductDto } from "../../types/product.tying";
import ProductForm from "../../components/product/ProductForm.component";
import ProductGrid from "../../components/product/ProductGrid.component";
import ProductService from "../../services/ProductService";
import SearchBox from "../../components/search/SearchBox.component";
import DeleteDialog from "../../components/dialog/DeleteDialog.component";

const Product = () => {
  const [products, setProducts] = useState<IProductDto[]>([]);
  const [productCode, setProductCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");
  const [searchType, setSearchType] = useState<string>("partial");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deleteProductCode, setDeleteProductCode] = useState<string>("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productData = await ProductService.getAllProducts(
        page,
        pageSize,
        undefined,
        undefined,
        searchTerm,
        searchColumn,
        searchType
      );

      if (!productData || !productData.items) {
        console.error("Product data or items is undefined");
      } else {
        setProducts(productData.items);
        setTotalProducts(productData.totalCount);
      }
    } catch (error) {
      console.error("Error fetching products", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm, searchColumn, searchType]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openForm = () => setIsFormOpen(true);

  const closeForm = () => setIsFormOpen(false);

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);

  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleClickAddBtn = () => {
    setProductCode("");
    setIsFormOpen((prev) => !prev);
  };

  const handleClickEditBtn = (productCode: string) => {
    setProductCode(productCode);
    openForm();
  };

  const handleClickDeleteBtn = async (productCode: string) => {
    setDeleteProductCode(productCode);
    openDeleteDialog();
  };

  const deleteProduct = async () => {
    try {
      await ProductService.deleteProduct(deleteProductCode);
      closeDeleteDialog();
      toast.success("Product deleted successfully!");
      setPage(1);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product. Please try again.");
    } finally {
      closeDeleteDialog();
    }
  };

  const handleSaveSuccess = async (newProductCode: string) => {
    if (productCode === "") {
      setProductCode(newProductCode);
    }
    fetchProducts();
  };

  const handleClickCancelBtn = () => {
    closeForm();
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleSearch = (
    searchTerm: string,
    searchColumn: string,
    searchType: string
  ) => {
    setSearchTerm(searchTerm);
    setSearchColumn(searchColumn);
    setSearchType(searchType);
    setPage(1);
  };

  return (
    <Paper className="content">
      <Box
        className="heading"
        sx={{
          backgroundColor: "#f9f9f9",
          padding: 2,
          borderBottom: 2,
          borderColor: "#ccc",
        }}
      >
        <Typography variant="h3" gutterBottom>
          {isFormOpen
            ? productCode === ""
              ? "Create Products"
              : "Edit Products"
            : "Products"}
        </Typography>
        <Button variant="contained" onClick={handleClickAddBtn}>
          {isFormOpen ? "Back To Listing" : "Create New Product"}
        </Button>
      </Box>

      {isFormOpen ? (
        <div className="form-content">
          <ProductForm
            productCode={productCode}
            onSaveSuccess={handleSaveSuccess}
            handleClickCancelBtn={handleClickCancelBtn}
          />
        </div>
      ) : (
        <>
          <Box sx={{ p: 2 }}>
            <SearchBox onSearch={handleSearch} />
          </Box>
          {loading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={100} />
            </Box>
          ) : products?.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5">Not found</Typography>
            </Box>
          ) : (
            <ProductGrid
              products={products}
              page={page}
              pageSize={pageSize}
              totalProducts={totalProducts}
              searchTerm={searchTerm}
              searchColumn={searchColumn}
              searchType={searchType}
              handleClickEditBtn={handleClickEditBtn}
              handleClickDeleteBtn={handleClickDeleteBtn}
              onChangePage={handleChangePage}
              onChangePageSize={handleChangePageSize}
            />
          )}
          <DeleteDialog
            item={"product"}
            isOpen={isDeleteDialogOpen}
            handleClose={() => setIsDeleteDialogOpen(false)}
            handleConfirm={deleteProduct}
          />
        </>
      )}
    </Paper>
  );
};

export default Product;
