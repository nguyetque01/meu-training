using backend.Models;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IProductRepository
    {
        Task<(int totalCount, IEnumerable<Product> products)> GetProductsAsync(int page, int size, string sort, string dir, string search = "", string searchColumn = "", string searchType = "");
        Task<Product> GetProductByCodeAsync(string code);
        Task<bool> AddProductAsync(Product product);
        Task<bool> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(string code);
        Task<bool> ProductExistsAsync(string code);
    }
}