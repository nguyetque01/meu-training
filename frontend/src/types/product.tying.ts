import { IBrand } from "./brand.tying";
import { IType } from "./type.tying";

export interface IProduct {
  id: number;
  code: string;
  name: string;
  category: string;
  brandId?: number;
  typeId?: number;
  description?: string;
}

export interface IProductDto {
  id: number;
  code: string;
  name: string;
  category: string;
  brand?: IBrand;
  type?: IType;
  description?: string;
  searchMatches: {
    id?: number[];
    code?: number[];
    name?: number[];
    category?: number[];
    brand?: number[];
    type?: number[];
    description?: number[];
  };
}

export interface ICreateProduct {
  code: string;
  name: string;
  category: string;
  brandId?: number;
  typeId?: number;
  description?: string;
}
