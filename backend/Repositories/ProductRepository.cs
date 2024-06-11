using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using backend.Models;
using backend.Helpers;
using System.Text.RegularExpressions;
using backend.DTOs;
using System.Drawing.Drawing2D;
using System.Linq;

namespace backend.Repositories
{
    public interface IProductRepository
    {
        Task<(int totalCount, IEnumerable<ProductDto> products)> GetProductsAsync(int page, int size, string sort, string dir, string search = "", string searchColumn = "", string searchType = "", int[]? brandId = null, int[]? typeId = null);
        Task<Product> GetProductByCodeAsync(string code);
        Task<ProductDto> GetProductDetailByCodeAsync(string code);
        Task<bool> AddProductAsync(Product product);
        Task<bool> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(string code);
        Task<bool> ProductExistsAsync(string code);
    }
    public class ProductRepository : IProductRepository
    {
        private readonly MeuTrainingContext _context;
        private readonly SearchHelper _searchHelper;

        public ProductRepository(MeuTrainingContext context, SearchHelper searchHelper)
        {
            _context = context;
            _searchHelper = searchHelper;
        }

        public async Task<(int totalCount, IEnumerable<ProductDto> products)> GetProductsAsync(int page, int size, string sort, string dir, string search = "", string searchColumn = "", string searchType = "", int[]? brandId = null, int[]? typeId = null)
        {
            var query = _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Type)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Code = p.Code,
                    Name = p.Name,
                    Category = p.Category,
                    Brand = p.Brand != null ? new BrandDto { Id = p.Brand.Id, Name = p.Brand.Name } : null,
                    Type = p.Type != null ? new TypeDto { Id = p.Type.Id, Name = p.Type.Name } : null,
                    Description = p.Description
                })
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = _searchHelper.ApplyProductSearchFilter(query, search, searchColumn, searchType);
            }

            if (brandId != null && brandId.Any())
            {
                query = query.Where(p => brandId.Contains(p.Brand.Id));
            }

            if (typeId != null && typeId.Any())
            {
                query = query.Where(p => typeId.Contains(p.Type.Id));
            }

            var totalCount = await query.CountAsync();
            var products = await query.OrderBy($"{sort} {dir}")
                                      .Skip((page - 1) * size)
                                      .Take(size)
                                      .ToListAsync();

            if (!string.IsNullOrWhiteSpace(search))
            {
                _searchHelper.UpdateProductSearchResults(products, search, searchColumn, searchType);
            }

            return (totalCount, products);
        }

        public async Task<Product> GetProductByCodeAsync(string code)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == code);

            if (product == null)
            {
                throw new InvalidOperationException("Product not found");
            }
            return product;
        }

        public async Task<ProductDto> GetProductDetailByCodeAsync(string code)
        {
            var product = await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.Type)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Code = p.Code,
                    Name = p.Name,
                    Category = p.Category,
                    Brand = p.Brand != null ? new BrandDto { Id = p.Brand.Id, Name = p.Brand.Name } : null,
                    Type = p.Type != null ? new TypeDto { Id = p.Type.Id, Name = p.Type.Name } : null,
                    Description = p.Description
                })
                .FirstOrDefaultAsync(p => p.Code == code);

            if (product == null)
            {
                throw new InvalidOperationException("Product not found");
            }
            return product;
        }

        public async Task<bool> AddProductAsync(Product product)
        {
            _context.Products.Add(product);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateProductAsync(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteProductAsync(string code)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == code);
            if (product != null)
            {
                _context.Products.Remove(product);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<bool> ProductExistsAsync(string code)
        {
            return await _context.Products.AnyAsync(e => e.Code == code);
        }
    }
}