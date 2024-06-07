import httpModule from "../helpers/http.module";
import { ApiResponse } from "../types/global.typing";
import { ICreateBrand, IBrand } from "../types/brand.tying";

const API_ENDPOINT = "/brands";

const BrandService = {
  getBrandsPage: async (
    page: number = 1,
    size: number = 10,
    sort: string = "id",
    dir: string = "asc",
    search: string = "",
    searchColumn: string = "all",
    searchType: string = "partial"
  ): Promise<{ items: IBrand[]; totalCount: number }> => {
    try {
      let endpoint = `${API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}&dir=${dir}`;
      if (search) {
        endpoint += `&search=${search}&searchColumn=${searchColumn}&searchType=${searchType}`;
      }

      const response = await httpModule.get<
        ApiResponse<{
          items: IBrand[];
          totalCount: number;
        }>
      >(endpoint);

      if (response.data.status === "success") {
        return response.data.responseData;
      }

      throw new Error(response.data.message);
    } catch (error) {
      throw new Error("Failed to fetch brands");
    }
  },

  getAllBrands: async (): Promise<IBrand[]> => {
    try {
      const response = await httpModule.get<ApiResponse<IBrand[]>>(
        API_ENDPOINT
      );
      if (response.data.status === "success") {
        return response.data.responseData;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to fetch brands");
    }
  },

  getBrandById: async (brandId: number): Promise<IBrand> => {
    try {
      const response = await httpModule.get<ApiResponse<IBrand>>(
        `${API_ENDPOINT}/${brandId}`
      );
      if (response.data.status === "success") {
        return response.data.responseData;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to fetch brand");
    }
  },

  createBrand: async (brandData: ICreateBrand): Promise<IBrand> => {
    try {
      const response = await httpModule.post<ApiResponse<IBrand>>(
        API_ENDPOINT,
        brandData
      );
      if (response.data.status === "success") {
        return response.data.responseData;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to create brand");
    }
  },

  updateBrand: async (
    brandId: number,
    brandData: ICreateBrand
  ): Promise<void> => {
    try {
      const response = await httpModule.put<ApiResponse<any>>(
        `${API_ENDPOINT}/${brandId}`,
        brandData
      );
      if (response.data.status === "fail") {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to update brand");
    }
  },

  deleteBrand: async (brandId: number): Promise<void> => {
    try {
      const response = await httpModule.delete<ApiResponse<any>>(
        `${API_ENDPOINT}/${brandId}`
      );
      if (response.data.status === "fail") {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to delete brand");
    }
  },
};

export default BrandService;
