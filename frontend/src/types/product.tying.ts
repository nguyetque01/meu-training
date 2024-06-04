export interface IProduct {
  id: number;
  code: string;
  name: string;
  category: string;
  brand?: string;
  type?: string;
  description?: string;
  searchMatches: {
    Id?: number[];
    Code?: number[];
    Name?: number[];
    Category?: number[];
    Brand?: number[];
    Type?: number[];
    Description?: number[];
  };
}

export interface ICreateProduct {
  code: string;
  name: string;
  category: string;
  brand?: string;
  type?: string;
  description?: string;
}
