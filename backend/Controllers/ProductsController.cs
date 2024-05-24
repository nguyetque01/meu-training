using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using NuGet.Protocol.Core.Types;

namespace backend.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        private ObjectResult CreateResponse(string message, object? data, string status)
        {
            return new ObjectResult(new
            {
                message = message,
                responseData = data,
                status = status,
                timeStamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            });
        }

        // GET: /api/products?page=1&size=5&sort=id&dir=asc
        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] int page = 1,
            [FromQuery] int size = 5,
            [FromQuery] string sort = "id",
            [FromQuery] string dir = "asc")
        {
            try
            {
                if (page <= 0) page = 1;
                if (size <= 0) size = 5;

                var totalItems = await _productRepository.GetTotalProductsCountAsync();
                var pagedResult = await _productRepository.GetProductsPagedAsync(page, size, sort, dir);

                return CreateResponse("Products retrieved successfully", new { items = pagedResult, totalCount = totalItems }, "success");
            }
            catch (Exception ex)
            {
                return CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // GET: api/products/code
        [HttpGet("{code}")]
        public async Task<IActionResult> GetProduct(string code)
        {
            try
            {
                var product = await _productRepository.GetProductByCodeAsync(code);
                if (product == null)
                {
                    return CreateResponse("Product not found", null, "fail");
                }
                return CreateResponse("Product retrieved successfully", product, "success");
            }
            catch (Exception ex)
            {
                return CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> AddProduct(Product product)
        {
            try
            {
                bool result = await _productRepository.AddProductAsync(product);
                if (result)
                {
                    return CreateResponse("Product added successfully", product, "success");
                }
                else
                {
                    return CreateResponse("Product addition failed", null, "fail");
                }
            }
            catch (Exception ex)
            {
                return CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // PUT: api/products/code
        [HttpPut("{code}")]
        public async Task<IActionResult> PutProduct(string code, Product product)
        {
            try
            {
                if (code != product.Code)
                {
                    return CreateResponse("Product code mismatch", null, "fail");
                }

                var codeExists = await _productRepository.ProductExistsAsync(product.Code);
                if (!codeExists)
                {
                    return CreateResponse("Product not found", null, "fail");
                }

                bool result = await _productRepository.UpdateProductAsync(product);
                if (result)
                {
                    return CreateResponse("Product updated successfully", product, "success");
                }
                else
                {
                    return CreateResponse("Product update failed", null, "fail");
                }
            }
            catch (Exception ex)
            {
                return CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // DELETE: api/products/code
        [HttpDelete("{code}")]
        public async Task<IActionResult> DeleteProduct(string code)
        {
            try
            {
                bool result = await _productRepository.DeleteProductAsync(code);
                if (result)
                {
                    return CreateResponse("Product deleted successfully", null, "success");
                }
                else
                {
                    return CreateResponse("Product not found", null, "fail");
                }
            }
            catch (Exception ex)
            {
                return CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }
    }
}