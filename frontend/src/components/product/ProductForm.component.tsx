import { useCallback, useEffect, useState } from "react";
import { ICreateProduct } from "../../types/product.tying";
import {
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ProductService from "../../services/ProductService";
import { toast } from "react-toastify";
import { mapProductDtoToCreateProduct } from "../../utils/mappers.utils";
import { IBrand } from "../../types/brand.tying";
import { IType } from "../../types/type.tying";
import BrandService from "../../services/BrandService";
import TypeService from "../../services/TypeService";

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
    brandId: undefined,
    typeId: undefined,
    description: "",
  });
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [types, setTypes] = useState<IType[]>([]);
  const [loading, setLoading] = useState(false);
  const isEditing = productCode !== "";

  const fetchProductData = useCallback(async () => {
    if (isEditing) {
      try {
        const data = await ProductService.getProductByCode(productCode);
        setProduct(data);
      } catch (error) {
        console.error("Error to fetch product data:", error);
        toast.error("Error to fetch product data.");
      } finally {
      }
    }
  }, [isEditing, productCode]);

  const fetchBrandsAndTypes = useCallback(async () => {
    try {
      setLoading(true);
      const brandsData = await BrandService.getAllBrands();
      const typesData = await TypeService.getAllTypes();
      setBrands(brandsData);
      setTypes(typesData);
    } catch (error) {
      console.error("Error to fetch brands and types:", error);
      toast.error("Error to fetch brands and types.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductData();
    fetchBrandsAndTypes();
  }, [fetchProductData, fetchBrandsAndTypes]);

  const handleInputChange = (field: string, value: string | number) => {
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
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 600,
          }}
        >
          <CircularProgress size={100} />
        </Paper>
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
              <FormControl fullWidth variant="outlined">
                <InputLabel id="brand-select-label">Brand</InputLabel>
                <Select
                  labelId="brand-select-label"
                  id="brand-select"
                  value={product.brandId}
                  onChange={(e) =>
                    handleInputChange("brandId", e.target.value as number)
                  }
                  label="Brand"
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  value={product.typeId}
                  onChange={(e) =>
                    handleInputChange("typeId", e.target.value as number)
                  }
                  label="Type"
                >
                  {types.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
