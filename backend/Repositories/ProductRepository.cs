using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using backend.Models;
using backend.Helpers;
using System.Text.RegularExpressions;

namespace backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly MeuTrainingContext _context;
        private readonly SearchHelper _searchHelper;

        public ProductRepository(MeuTrainingContext context, SearchHelper searchHelper)
        {
            _context = context;
            _searchHelper = searchHelper;
        }

        public async Task<(int totalCount, IEnumerable<Product> products)> GetProductsAsync(int page, int size, string sort, string dir, string search = "", string searchColumn = "")
        {
            var sortableFields = new List<string> { "id", "code", "name", "category", "brand", "type", "description" };
            if (!sortableFields.Contains(sort.ToLower())) sort = "id";
            if (dir.ToLower() != "desc" && dir.ToLower() != "asc") dir = "asc";

            string orderBy = $"{sort} {dir}";

            var query = _context.Products.AsQueryable();

            int totalCount;
            IEnumerable<Product> products;

            if (!string.IsNullOrWhiteSpace(search))
            {
                var allProducts = await query.ToListAsync();
                var filteredProducts = _searchHelper.ProductSearchFilter(allProducts, search, searchColumn);
                totalCount = filteredProducts.Count();
                products = filteredProducts.AsQueryable().OrderBy(orderBy).Skip((page - 1) * size).Take(size).ToList();
            }
            else
            {
                totalCount = await query.CountAsync();
                products = await query.OrderBy(orderBy).Skip((page - 1) * size).Take(size).ToListAsync();
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
