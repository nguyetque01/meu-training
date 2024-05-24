using backend.Models;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IProductRepository
    {
        Task<int> GetTotalProductsCountAsync();
        Task<List<Product>> GetProductsPagedAsync(int page, int size, string sort, string dir);
        Task<Product> GetProductByCodeAsync(string code);
        Task<bool> AddProductAsync(Product product);
        Task<bool> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(string code);
        Task<bool> ProductExistsAsync(string code);
    }
}