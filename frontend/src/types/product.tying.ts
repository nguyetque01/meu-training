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
  brand?: string;
  type?: string;
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
