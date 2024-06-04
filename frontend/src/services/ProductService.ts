import httpModule from "../helpers/http.module";
import { IProduct, ICreateProduct } from "../types/product.tying";
interface ApiResponse<T> {
  status: string;
  message: string;
  responseData: T;
  timeStamp: string;
}

const API_ENDPOINT = "/products";

const ProductService = {
  getAllProducts: async (
    page: number = 1,
    size: number = 10,
    sort: string = "id",
    dir: string = "asc",
    search: string = "",
    searchColumn: string = "all",
    searchType: string = "partial"
  ): Promise<{ items: IProduct[]; totalCount: number }> => {
    try {
      let endpoint = `${API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}&dir=${dir}`;
      if (search) {
        endpoint += `&search=${search}&searchColumn=${searchColumn}&searchType=${searchType}`;
      }

      const response = await httpModule.get<
        ApiResponse<{
          items: IProduct[];
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
