import httpModule from "../helpers/http.module";
import { ApiResponse } from "../types/global.typing";
import { IType } from "../types/type.tying";

const API_ENDPOINT = "/types";

const TypeService = {
  getAllTypes: async (): Promise<IType[]> => {
    try {
      const response = await httpModule.get<ApiResponse<IType[]>>(API_ENDPOINT);
      if (response.data.status === "success") {
        return response.data.responseData;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to fetch types");
    }
  },

  getAllTypeDetails: async (): Promise<IType[]> => {
    try {
      const response = await httpModule.get<ApiResponse<IType[]>>(
        `${API_ENDPOINT}/details`
      );
      if (response.data.status === "success") {
        return response.data.responseData;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to fetch types");
    }
  },

  getTypeById: async (typeId: number): Promise<IType> => {
    try {
      const response = await httpModule.get<ApiResponse<IType>>(
        `${API_ENDPOINT}/${typeId}`
      );
      if (response.data.status === "success") {
        return response.data.responseData;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error("Failed to fetch type");
    }
  },
};

export default TypeService;
