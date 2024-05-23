using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Drawing;
using System.Linq.Dynamic.Core;
namespace backend.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly MeuTrainingContext _context;

        public ProductsController(MeuTrainingContext context)
        {
            _context = context;
        }

        private ObjectResult CreateResponse(string message, object data, string status)
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

                var sortableFields = new List<string> { "id", "code", "name", "category", "brand", "type", "description" };
                if (!sortableFields.Contains(sort.ToLower())) sort = "id";
                if (dir.ToLower() != "desc" && dir.ToLower() != "asc") dir = "asc";

                string orderBy = $"{sort} {dir}";

                IQueryable<Product> query = _context.Products.OrderBy(orderBy);

                var totalItems = await query.CountAsync();
                var pagedResult = await query.Skip((page - 1) * size).Take(size).ToListAsync();

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
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == code);
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
        public async Task<IActionResult> PostProduct(Product product)
        {
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return CreateResponse("Product created successfully", product, "success");
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

                if (!ProductExists(product.Code))
                {
                    return CreateResponse("Product not found", null, "fail");
                }

                if (!ProductExists(product.Id))
                {
                    return CreateResponse("Product ID not found", null, "fail");
                }

                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return CreateResponse("Product updated successfully", product, "success");
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
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == code);
                if (product == null)
                {
                    return CreateResponse("Product not found", null, "fail");
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return CreateResponse("Product deleted successfully", null, "success");
            }
            catch (Exception ex)
            {
                return CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        private bool ProductExists(string code)
        {
            return _context.Products.Any(e => e.Code == code);
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
