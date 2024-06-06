import { useCallback, useEffect, useState } from "react";
import { ICreateProduct } from "../../types/product.tying";
import {
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import ProductService from "../../services/ProductService";
import { toast } from "react-toastify";
import { mapProductDtoToCreateProduct } from "../../utils/mappers";

interface IProductFormProps {
  handleClickCancelBtn: () => void;
  onSaveSuccess: (newProductCode: string) => void;
  productCode: string;
}

const ProductForm = ({
  productCode,
  onSaveSuccess,
  handleClickCancelBtn,
}: IProductFormProps) => {
  const [product, setProduct] = useState<ICreateProduct>({
    code: "",
    name: "",
    category: "",
    brandId: 0,
    typeId: 0,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const isEditing = productCode !== "";

  const fetchProductData = useCallback(async () => {
    if (isEditing) {
      try {
        const data = await ProductService.getProductByCode(productCode);
        const editingData = mapProductDtoToCreateProduct(data);
        setProduct(editingData);
      } catch (error) {
        console.error("Error to fetch product data:", error);
        toast.error("Error to fetch product data.");
      } finally {
      }
    }
  }, [isEditing, productCode]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleInputChange = (field: string, value: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleClickSaveBtn = () => {
    setLoading(true);
    const savePromise = isEditing
      ? ProductService.updateProduct(productCode, product)
      : ProductService.createProduct(product);

    savePromise
      .then((newProduct) => {
        const newProductCode = newProduct?.code || "";
        toast.success("Save successfully!");
        handleClickCancelBtn();
        onSaveSuccess(newProductCode);
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while saving!");
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
                disabled={isEditing}
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
                value={product.brandId}
                onChange={(e) => handleInputChange("brandId", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Type"
                variant="outlined"
                value={product.typeId}
                onChange={(e) => handleInputChange("typeId", e.target.value)}
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
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </Paper>
      )}
    </>
  );
};

export default ProductForm;
