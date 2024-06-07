using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Helpers;
using System.Linq.Dynamic.Core;
using System.Text.RegularExpressions;

namespace backend.Repositories
{
    public interface IBrandRepository
    {
        Task<IEnumerable<Brand>> GetAllBrands();
        Task<(int totalCount, IEnumerable<Brand> brands)> GetBrandsPageAsync(int page, int size, string sort, string dir, string search = "", string searchColumn = "", string searchType = "");
        Task<Brand> GetBrandById(int id);
        Task AddBrand(Brand brand);
        Task UpdateBrand(Brand brand);
        Task DeleteBrand(int id);
        Task<bool> BrandExists(int id);
    }

    public class BrandRepository : IBrandRepository
    {
        private readonly MeuTrainingContext _context;
        private readonly SearchHelper _searchHelper;

        public BrandRepository(MeuTrainingContext context, SearchHelper searchHelper)
        {
            _context = context;
            _searchHelper = searchHelper;
        }

        public async Task<IEnumerable<Brand>> GetAllBrands()
        {
            return await _context.Brands.ToListAsync();
        }

        public async Task<(int totalCount, IEnumerable<Brand> brands)> GetBrandsPageAsync(int page, int size, string sort, string dir, string search = "", string searchColumn = "", string searchType = "")
        {
            var query = _context.Brands.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = _searchHelper.ApplyBrandSearchFilter(query, search, searchColumn, searchType);
            }

            var totalCount = await query.CountAsync();
            var brands = await query.OrderBy($"{sort} {dir}")
                                      .Skip((page - 1) * size)
                                      .Take(size)
                                      .ToListAsync();

            if (!string.IsNullOrWhiteSpace(search))
            {
                _searchHelper.UpdateBrandSearchResults(brands, search, searchColumn, searchType);
            }

            return (totalCount, brands);
        }

        public async Task<Brand> GetBrandById(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
            {
                throw new InvalidOperationException("Brand not found");
            }
            return brand;
        }

        public async Task AddBrand(Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBrand(Brand brand)
        {
            _context.Entry(brand).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand != null)
            {
                _context.Brands.Remove(brand);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> BrandExists(int id)
        {
            return await _context.Brands.AnyAsync(e => e.Id == id);
        }
    }
}
