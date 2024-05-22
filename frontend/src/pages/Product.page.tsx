import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { IProduct } from "../types/product.tying";
import ProductForm from "../components/ProductForm.component";
import ProductGrid from "../components/ProductGrid.component";
import ProductService from "../services/ProductService";

const Product = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productCode, setProductCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productData = await ProductService.getAllProducts(page, pageSize);
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
  };

  const openForm = () => setIsFormOpen(true);

  const closeForm = () => setIsFormOpen(false);

  const handleClickAddBtn = () => {
    setProductCode("");
    setIsFormOpen((prev) => !prev);
  };

  const handleClickEditBtn = (productCode: string) => {
    setProductCode(productCode);
    openForm();
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
      {loading ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <CircularProgress size={100} />
        </Box>
      ) : products?.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h5">Not found</Typography>
        </Box>
      ) : isFormOpen ? (
        <div className="form-content">
          <ProductForm
            productCode={productCode}
            onSaveSuccess={handleSaveSuccess}
            handleClickCancelBtn={handleClickCancelBtn}
          />
        </div>
      ) : (
        <ProductGrid
          products={products}
          handleClickEditBtn={handleClickEditBtn}
          page={page}
          pageSize={pageSize}
          totalProducts={totalProducts}
          onChangePage={handleChangePage}
          onChangePageSize={handleChangePageSize}
        />
      )}
    </Paper>
  );
};

export default Product;
