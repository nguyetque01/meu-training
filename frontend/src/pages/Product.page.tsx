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
import ProductGrid from "../components/ProductGrid.component";
import ProductForm from "../components/ProductForm.component";
import ProductServices from "../services/ProductServices";

const Product = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productId, setProductId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await ProductServices.getAllProducts();
      setProducts(productData);
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
    setProductId(0);
    setIsFormOpen((prev) => !prev);
  };

  const handleClickEditBtn = (productId: number) => {
    setProductId(productId);
    openForm();
  };

  const handleSaveSuccess = async (newProductId: number) => {
    if (productId === 0) {
      setProductId(newProductId);
    }
    fetchProduct();
  };

  const handleClickCancelBtn = () => {
    closeForm();
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
            ? productId === 0
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
      ) : products.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h5">Not found</Typography>
        </Box>
      ) : isFormOpen ? (
        <div className="form-content">
          <ProductForm
            productId={productId}
            onSaveSuccess={handleSaveSuccess}
            handleClickCancelBtn={handleClickCancelBtn}
          />
        </div>
      ) : (
        <ProductGrid
          products={products}
          handleClickEditBtn={handleClickEditBtn}
        />
      )}
    </Paper>
  );
};

export default Product;
