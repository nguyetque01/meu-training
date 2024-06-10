import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { IBrand } from "../../types/brand.tying";
import BrandForm from "../../components/brand/BrandForm.component";
import BrandGrid from "../../components/brand/BrandGrid.component";
import BrandService from "../../services/BrandService";
import SearchBox from "../../components/search/SearchBox.component";
import DeleteDialog from "../../components/dialog/DeleteDialog.component";
import { brandColumns } from "../../constants/columns.contants";

const Brand = () => {
  const [brands, setbrands] = useState<IBrand[]>([]);
  const [brandId, setbrandId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalbrands, setTotalbrands] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");
  const [searchType, setSearchType] = useState<string>("partial");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deleteBrandId, setDeleteBrandId] = useState<number>(0);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);

      const brandData = await BrandService.getBrandsPage(
        page,
        pageSize,
        undefined,
        undefined,
        searchTerm,
        searchColumn,
        searchType
      );
      if (!brandData || !brandData.items) {
        console.error("Brand data or items is undefined");
      } else {
        setbrands(brandData.items);
        setTotalbrands(brandData.totalCount);
      }
    } catch (error) {
      console.error("Error fetching brands", error);
      toast.error("Error fetching brands");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm, searchColumn, searchType]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const openForm = () => setIsFormOpen(true);

  const closeForm = () => setIsFormOpen(false);

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);

  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleClickAddBtn = () => {
    setbrandId(0);
    setIsFormOpen((prev) => !prev);
  };

  const handleClickEditBtn = (brandId: number) => {
    setbrandId(brandId);
    openForm();
  };

  const handleClickDeleteBtn = async (brandId: number) => {
    setDeleteBrandId(brandId);
    openDeleteDialog();
  };

  const deleteBrand = async () => {
    try {
      await BrandService.deleteBrand(deleteBrandId);
      closeDeleteDialog();
      toast.success("Brand deleted successfully!");
      fetchBrands();
      setPage(1);
    } catch (error) {
      console.error("Error deleting Brand:", error);
      toast.error("Error deleting Brand. Please try again.");
    } finally {
      closeDeleteDialog();
    }
  };

  const handleSaveSuccess = async (newbrandId: number) => {
    if (brandId === 0) {
      setbrandId(newbrandId);
    }
    fetchBrands();
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
            ? brandId === 0
              ? "Create brands"
              : "Edit brands"
            : "Brands"}
        </Typography>
        <Button variant="contained" onClick={handleClickAddBtn}>
          {isFormOpen ? "Back To Listing" : "Create New Brand"}
        </Button>
      </Box>

      {isFormOpen ? (
        <div className="form-content">
          <BrandForm
            brandId={brandId}
            onSaveSuccess={handleSaveSuccess}
            handleClickCancelBtn={handleClickCancelBtn}
          />
        </div>
      ) : (
        <>
          <Box sx={{ p: 2 }}>
            <SearchBox columns={brandColumns} onSearch={handleSearch} />
          </Box>
          {loading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={100} />
            </Box>
          ) : brands?.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5">Not found</Typography>
            </Box>
          ) : (
            <BrandGrid
              brands={brands}
              page={page}
              pageSize={pageSize}
              totalBrands={totalbrands}
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
            item={"Brand"}
            isOpen={isDeleteDialogOpen}
            handleClose={() => setIsDeleteDialogOpen(false)}
            handleConfirm={deleteBrand}
          />
        </>
      )}
    </Paper>
  );
};

export default Brand;
