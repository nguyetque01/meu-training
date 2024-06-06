import { ICreateProduct, IProductDto } from "../types/product.tying";

export function mapProductDtoToCreateProduct(
  productDto: IProductDto
): ICreateProduct {
  return {
    code: productDto.code,
    name: productDto.name,
    category: productDto.category,
    brandId: productDto.brand ? parseInt(productDto.brand) : undefined,
    typeId: productDto.type ? parseInt(productDto.type) : undefined,
    description: productDto.description,
  };
}

export const mapCreateProductToProductDto = (
  createProduct: ICreateProduct,
  id: number
): IProductDto => ({
  id,
  code: createProduct.code,
  name: createProduct.name,
  category: createProduct.category,
  brand: createProduct.brandId ? createProduct.brandId.toString() : undefined,
  type: createProduct.typeId ? createProduct.typeId.toString() : undefined,
  description: createProduct.description,
  searchMatches: {},
});
