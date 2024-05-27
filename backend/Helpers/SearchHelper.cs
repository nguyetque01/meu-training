using backend.Models;

namespace backend.Helpers
{
    public class SearchHelper
    {
        public IQueryable<Product> ProductSearchFilter(IQueryable<Product> query, string search, string searchColumn)
        {
            return query.Where(p =>
                (searchColumn == "id" && p.Id.ToString().Contains(search)) ||
                (searchColumn == "code" && p.Code.Contains(search)) ||
                (searchColumn == "name" && p.Name.Contains(search)) ||
                (searchColumn == "category" && p.Category.Contains(search)) ||
                (searchColumn == "brand" && p.Brand != null && p.Brand.Contains(search)) ||
                (searchColumn == "type" && p.Type != null && p.Type.Contains(search)) ||
                (searchColumn == "description" && p.Description != null && p.Description.Contains(search)) ||
                (searchColumn == "" || searchColumn == "all") &&
                    (p.Id.ToString().Contains(search) ||
                     p.Code.Contains(search) ||
                     p.Name.Contains(search) ||
                     p.Category.Contains(search) ||
                     (p.Brand != null && p.Brand.Contains(search)) ||
                     (p.Type != null && p.Type.Contains(search)) ||
                     (p.Description != null && p.Description.Contains(search))));
        }
    }
}
