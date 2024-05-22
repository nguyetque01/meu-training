import httpModule from "../helpers/http.module";
import { IProduct, ICreateProduct } from "../types/product.tying";

const API_ENDPOINT = "/products";

const ProductService = {
  getAllProducts: async (
    page: number = 1,
    size: number = 10,
    sort: string = "id",
    dir: string = "asc"
  ): Promise<{ items: IProduct[]; totalCount: number }> => {
    try {
      const response = await httpModule.get<{
        items: IProduct[];
        totalCount: number;
      }>(`${API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}&dir=${dir}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  getProductById: async (productId: number): Promise<IProduct> => {
    try {
      const response = await httpModule.get<IProduct>(
        `${API_ENDPOINT}/${productId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  createProduct: async (productData: ICreateProduct): Promise<IProduct> => {
    try {
      const response = await httpModule.post<IProduct>(
        API_ENDPOINT,
        productData
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to create product");
    }
  },

  updateProduct: async (
    productId: number,
    productData: ICreateProduct
  ): Promise<void> => {
    try {
      await httpModule.put(`${API_ENDPOINT}/${productId}`, productData);
    } catch (error) {
      throw new Error("Failed to update product");
    }
  },

  deleteProduct: async (productId: number): Promise<void> => {
    try {
      await httpModule.delete(`${API_ENDPOINT}/${productId}`);
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  },
};

export default ProductService;
