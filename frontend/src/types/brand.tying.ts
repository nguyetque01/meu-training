export interface IBrand {
  id: number;
  name: string;
  searchMatches: {
    id?: number[];
    name?: number[];
  };
}

export interface ICreateBrand {
  name: string;
}
