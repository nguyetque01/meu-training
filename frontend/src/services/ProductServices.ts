import httpModule from "../helpers/http.module";
import { IProduct, ICreateProduct } from "../types/product.tying";

const API_ENDPOINT = "/Products";

const ProductService = {
  getAllProducts: async (): Promise<IProduct[]> => {
    try {
      const response = await httpModule.get<IProduct[]>(API_ENDPOINT);
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
