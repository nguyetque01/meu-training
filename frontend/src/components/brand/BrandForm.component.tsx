import { useCallback, useEffect, useState } from "react";
import { ICreateBrand } from "../../types/brand.tying";
import {
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import BrandService from "../../services/BrandService";
import { toast } from "react-toastify";

interface IBrandFormProps {
  handleClickCancelBtn: () => void;
  onSaveSuccess: (newBrandId: number) => void;
  brandId: number;
}

const BrandForm = ({
  brandId,
  onSaveSuccess,
  handleClickCancelBtn,
}: IBrandFormProps) => {
  const [brand, setBrand] = useState<ICreateBrand>({
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const isEditing = brandId !== 0;

  const fetchBrandData = useCallback(async () => {
    if (isEditing) {
      try {
        const data = await BrandService.getBrandById(brandId);
        setBrand(data);
      } catch (error) {
        console.error("Error to fetch Brand data:", error);
        toast.error("Error to fetch Brand data.");
      } finally {
      }
    }
  }, [isEditing, brandId]);

  useEffect(() => {
    fetchBrandData();
  }, [fetchBrandData]);

  const handleInputChange = (field: string, value: string | number) => {
    setBrand((prevBrand) => ({
      ...prevBrand,
      [field]: value,
    }));
  };

  const handleClickSaveBtn = () => {
    setLoading(true);
    const savePromise = isEditing
      ? BrandService.updateBrand(brandId, brand)
      : BrandService.createBrand(brand);

    savePromise
      .then((newBrand) => {
        const newBrandId = newBrand?.id || 0;
        toast.success("Save successfully!");
        handleClickCancelBtn();
        onSaveSuccess(newBrandId);
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
                label="Name"
                variant="outlined"
                value={brand.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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

export default BrandForm;
