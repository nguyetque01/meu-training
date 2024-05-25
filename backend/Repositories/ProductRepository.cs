using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using backend.Models;

namespace backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly MeuTrainingContext _context;

        public ProductRepository(MeuTrainingContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalProductsCountAsync(string search = "")
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search) ||
                                         p.Code.Contains(search) ||
                                         p.Category.Contains(search) ||
                                         (p.Brand != null && p.Brand.Contains(search)) ||
                                         (p.Type != null && p.Type.Contains(search)) ||
                                         (p.Description != null && p.Description.Contains(search)));
            }
            return await query.CountAsync();
        }

        public async Task<IEnumerable<Product>> GetProductsPagedAsync(int page, int size, string sort, string dir, string search = "")
        {
            var sortableFields = new List<string> { "id", "code", "name", "category", "brand", "type", "description" };
            if (!sortableFields.Contains(sort.ToLower())) sort = "id";
            if (dir.ToLower() != "desc" && dir.ToLower() != "asc") dir = "asc";

            string orderBy = $"{sort} {dir}";

            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Code.Contains(search) ||
                                         p.Name.Contains(search) ||
                                         p.Category.Contains(search) ||
                                         (p.Brand != null && p.Brand.Contains(search)) ||
                                         (p.Type != null && p.Type.Contains(search)) ||
                                         (p.Description != null && p.Description.Contains(search)));
            }     
            return await query.OrderBy(orderBy).Skip((page - 1) * size).Take(size).ToListAsync();
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
