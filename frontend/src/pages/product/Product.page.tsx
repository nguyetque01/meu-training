import { useCallback, useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { IProductDto } from "../../types/product.tying";
import { IBrand } from "../../types/brand.tying";
import { IType } from "../../types/type.tying";
import ProductForm from "../../components/product/ProductForm.component";
import ProductGrid from "../../components/product/ProductGrid.component";
import ProductService from "../../services/ProductService";
import SearchBox from "../../components/search/SearchBox.component";
import DeleteDialog from "../../components/dialog/DeleteDialog.component";
import { productSearchColumns } from "../../constants/columns.contants";
import BrandService from "../../services/BrandService";
import TypeService from "../../services/TypeService";

const Product = () => {
  const [products, setProducts] = useState<IProductDto[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [types, setTypes] = useState<IType[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<IBrand[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<IType[]>([]);
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
    const selectedBrandIds: number[] = selectedBrands.map((brand) => brand.id);
    const selectedTypeIds: number[] = selectedTypes.map((type) => type.id);
    try {
      setLoading(true);
      const productData = await ProductService.getAllProducts(
        page,
        pageSize,
        undefined,
        undefined,
        searchTerm,
        searchColumn,
        searchType,
        selectedBrandIds,
        selectedTypeIds
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
  }, [
    page,
    pageSize,
    searchTerm,
    searchColumn,
    searchType,
    selectedBrands,
    selectedTypes,
  ]);

  const fetchBrands = useCallback(async () => {
    try {
      const brandData = await BrandService.getAllBrands();
      setBrands(brandData);
    } catch (error) {
      console.error("Error fetching brands", error);
      toast.error("Error fetching brands");
    }
  }, []);

  const fetchTypes = useCallback(async () => {
    try {
      const typeData = await TypeService.getAllTypes();
      setTypes(typeData);
    } catch (error) {
      console.error("Error fetching types", error);
      toast.error("Error fetching types");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchTypes();
  }, [fetchProducts, fetchBrands, fetchTypes, page]);

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
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchProducts();
      }
      closeDeleteDialog();
      toast.success("Product deleted successfully!");
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

  const handleSelectBrands = (brands: IBrand[]) => {
    setSelectedBrands(brands);
  };

  const handleSelectTypes = (types: IType[]) => {
    setSelectedTypes(types);
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
            <SearchBox columns={productSearchColumns} onSearch={handleSearch} />
          </Box>
          <ProductGrid
            isLoading={loading}
            products={products}
            brands={brands}
            types={types}
            page={page}
            pageSize={pageSize}
            totalProducts={totalProducts}
            searchTerm={searchTerm}
            searchColumn={searchColumn}
            searchType={searchType}
            selectedBrands={selectedBrands}
            selectedTypes={selectedTypes}
            handleClickEditBtn={handleClickEditBtn}
            handleClickDeleteBtn={handleClickDeleteBtn}
            onChangePage={handleChangePage}
            onChangePageSize={handleChangePageSize}
            onSelectBrands={handleSelectBrands}
            onSelectTypes={handleSelectTypes}
          />
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
