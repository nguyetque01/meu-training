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

        // GET: api/products
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        //{
        //    return await _context.Products.ToListAsync();
        //}

        // GET: /api/products?page=1&size=5&sort=name&dir=desc
    

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
            [FromQuery] int page = 1,
            [FromQuery] int size = 5,
            [FromQuery] string sort = "id",
            [FromQuery] string dir = "asc")
        {
            if (page <= 0) page = 1;
            if (size <= 0) size = 5;

            // List of valid sortable fields
            var sortableFields = new List<string> { "id", "code", "name", "category", "brand", "type", "description" };
            if (!sortableFields.Contains(sort.ToLower())) sort = "id";
            if (dir.ToLower() != "desc" && dir.ToLower() != "asc") dir = "asc";

            string orderBy = $"{sort} {dir}";

            IQueryable<Product> query = _context.Products.OrderBy(orderBy);

            var totalItems = await query.CountAsync();
            var pagedResult = await query.Skip((page - 1) * size).Take(size).ToListAsync();

            return Ok(new { items = pagedResult, totalCount = totalItems });
        }



        // GET: api/products/id
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // PUT: api/products/id
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }       

        // DELETE: api/products/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
