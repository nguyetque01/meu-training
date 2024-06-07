using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Repositories;
using backend.Helpers;

namespace backend.Controllers
{
    [Route("api/brands")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandRepository _brandRepository;
        private readonly ResponseHelper _responseHelper;

        public BrandsController(IBrandRepository brandRepository, ResponseHelper responseHelper)
        {
            _brandRepository = brandRepository;
            _responseHelper = responseHelper;
        }

        // GET: api/brands/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBrands()
        {
            try
            {
                var brands = await _brandRepository.GetAllBrands();
                return _responseHelper.CreateResponse("Brands retrieved successfully", brands, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }


        // GET: /api/brands?page=1&size=5&sort=id&dir=asc
        [HttpGet]
        public async Task<IActionResult> GetBrandPages(
            [FromQuery] int page = 1,
            [FromQuery] int size = 5,
            [FromQuery] string sort = "id",
            [FromQuery] string dir = "asc",
            [FromQuery] string search = "",
            [FromQuery] string searchColumn = "all",
            [FromQuery] string searchType = "partial")
        {
            try
            {
                if (page <= 0) page = 1;
                if (size <= 0) size = 5;

                var (totalItems, pagedResult) = await _brandRepository.GetBrandsPageAsync(page, size, sort, dir, search, searchColumn, searchType);

                return _responseHelper.CreateResponse("Brands retrieved successfully", new { items = pagedResult, totalCount = totalItems }, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // GET: api/brands/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrand(int id)
        {
            try
            {
                var brand = await _brandRepository.GetBrandById(id);
                if (brand == null)
                {
                    return _responseHelper.CreateResponse("Brand not found", null, "fail");
                }
                return _responseHelper.CreateResponse("Brand retrieved successfully", brand, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // PUT: api/brands/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, Brand brand)
        {
            try
            {
                if (id != brand.Id)
                {
                    return _responseHelper.CreateResponse("Brand ID mismatch", null, "fail");
                }

                await _brandRepository.UpdateBrand(brand);

                return _responseHelper.CreateResponse("Brand updated successfully", null, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // POST: api/brands
        [HttpPost]
        public async Task<IActionResult> PostBrand(Brand brand)
        {
            try
            {
                await _brandRepository.AddBrand(brand);

                return _responseHelper.CreateResponse("Brand added successfully", brand, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }

        // DELETE: api/brands/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            try
            {
                var brandExists = await _brandRepository.BrandExists(id);
                if (!brandExists)
                {
                    return _responseHelper.CreateResponse("Brand not found", null, "fail");
                }

                await _brandRepository.DeleteBrand(id);

                return _responseHelper.CreateResponse("Brand deleted successfully", null, "success");
            }
            catch (Exception ex)
            {
                return _responseHelper.CreateResponse($"An error occurred: {ex.Message}", null, "fail");
            }
        }
    }
}
