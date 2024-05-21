import React, { useEffect, useState } from "react";
import { ICreateProduct } from "../types/product.tying";
import {
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import ProductService from "../services/ProductServices";

interface IProductFormProps {
  handleClickCancelBtn: () => void;
  onSaveSuccess: (newProduct: number) => void;
  productId: number;
}

const ProductForm = ({
  productId,
  onSaveSuccess,
  handleClickCancelBtn,
}: IProductFormProps) => {
  const [product, setProduct] = useState<ICreateProduct>({
    code: "",
    name: "",
    category: "",
    brand: "",
    type: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const isEditing = productId !== 0;

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    if (isEditing) {
      try {
        const data = await ProductService.getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error to fetch product data:", error);
        alert("Error to fetch product data.");
      } finally {
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleClickSaveBtn = () => {
    setLoading(true);

    const savePromise = isEditing
      ? ProductService.updateProduct(productId, product)
      : ProductService.createProduct(product);

    savePromise
      .then((newProduct) => {
        const newProductId = newProduct?.id || 0;
        alert("Save successfully!");
        handleClickCancelBtn();
        onSaveSuccess(newProductId);
      })
      .catch((error) => {
        console.log(error);
        alert("An error occurred while saving!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {isEditing && loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : (
        <Paper className="form" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code"
                variant="outlined"
                value={product.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={product.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                variant="outlined"
                value={product.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brand"
                variant="outlined"
                value={product.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                value={product.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                variant="outlined"
                value={product.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </Grid>
          </Grid>
          <div className="btns" style={{ textAlign: "center" }}>
            <Button
              className="save-btn"
              sx={{ mt: 2, textAlign: "center" }}
              variant="contained"
              onClick={handleClickSaveBtn}
            >
              Save
            </Button>
          </div>
        </Paper>
      )}
    </>
  );
};

export default ProductForm;
