export interface IProduct {
  id: number;
  code: string;
  name: string;
  category: string;
  brand?: string;
  type?: string;
  description?: string;
  searchMatches: { [key: string]: number[] };
}

export interface ICreateProduct {
  code: string;
  name: string;
  category: string;
  brand?: string;
  type?: string;
  description?: string;
}
