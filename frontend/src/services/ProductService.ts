import httpModule from "../helpers/http.module";
import { ApiResponse } from "../types/global.typing";
import { IProduct, IProductDto, ICreateProduct } from "../types/product.tying";

const API_ENDPOINT = "/products";

const ProductService = {
  getAllProducts: async (
    page: number = 1,
    size: number = 10,
    sort: string = "id",
    dir: string = "asc",
    search: string = "",
    searchColumn: string = "all",
    searchType: string = "partial",
    brandId: number[] = [],
    typeId: number[] = []
  ): Promise<{ items: IProductDto[]; totalCount: number }> => {
    try {
      let endpoint = `${API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}&dir=${dir}`;
      if (search) {
        endpoint += `&search=${search}&searchColumn=${searchColumn}&searchType=${searchType}`;
      }

      if (brandId.length > 0) {
        endpoint += brandId
          .map((b) => `&brandId=${encodeURIComponent(b.toString())}`)
          .join("");
      }

      if (typeId.length > 0) {
        endpoint += typeId
          .map((t) => `&typeId=${encodeURIComponent(t.toString())}`)
          .join("");
      }

      const response = await httpModule.get<
        ApiResponse<{
          items: IProductDto[];
          totalCount: number;
        }>
      >(endpoint);

      if (response.data.status === "success") {
        return response.data.responseData;
      }

      throw new Error(response.data.message);
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  getProductByCode: async (code: string): Promise<IProduct> => {
    try {
      const response = await httpModule.get<ApiResponse<IProduct>>(
        `${API_ENDPOINT}/${code}`
      );

      if (response.data.status === "success") {
        return response.data.responseData;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  getProductDetailByCode: async (code: string): Promise<IProductDto> => {
    try {
      const response = await httpModule.get<ApiResponse<IProductDto>>(
        `${API_ENDPOINT}/detail/${code}`
      );

      if (response.data.status === "success") {
        return response.data.responseData;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  createProduct: async (productData: ICreateProduct): Promise<IProduct> => {
    try {
      const response = await httpModule.post<ApiResponse<IProduct>>(
        API_ENDPOINT,
        productData
      );
      if (response.data.status === "success") {
        return response.data.responseData;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw new Error("Failed to create product");
    }
  },

  updateProduct: async (
    code: string,
    productData: ICreateProduct
  ): Promise<void> => {
    try {
      await httpModule.put(`${API_ENDPOINT}/${code}`, productData);
    } catch (error) {
      throw new Error("Failed to update product");
    }
  },

  deleteProduct: async (code: string): Promise<void> => {
    try {
      await httpModule.delete(`${API_ENDPOINT}/${code}`);
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  },
};

export default ProductService;
