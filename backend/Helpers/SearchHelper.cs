using System.Linq;
using System.Text.RegularExpressions;
using backend.Models;
using System.Linq.Dynamic.Core;


namespace backend.Helpers
{
    public class SearchHelper
    {
        public IEnumerable<Product> ProductSearchFilter(IEnumerable<Product> products, string search, string searchColumn)
        {
            string pattern = $@"\b{Regex.Escape(search)}\b";
            Regex regex = new Regex(pattern, RegexOptions.IgnoreCase);

            return products.Where(p =>
                (searchColumn == "id" && regex.IsMatch(p.Id.ToString())) ||
                (searchColumn == "code" && regex.IsMatch(p.Code)) ||
                (searchColumn == "name" && regex.IsMatch(p.Name)) ||
                (searchColumn == "category" && regex.IsMatch(p.Category)) ||
                (searchColumn == "brand" && p.Brand != null && regex.IsMatch(p.Brand)) ||
                (searchColumn == "type" && p.Type != null && regex.IsMatch(p.Type)) ||
                (searchColumn == "description" && p.Description != null && regex.IsMatch(p.Description)) ||
                (searchColumn == "" || searchColumn == "all") &&
                    (regex.IsMatch(p.Id.ToString()) ||
                     regex.IsMatch(p.Code) ||
                     regex.IsMatch(p.Name) ||
                     regex.IsMatch(p.Category) ||
                     (p.Brand != null && regex.IsMatch(p.Brand)) ||
                     (p.Type != null && regex.IsMatch(p.Type)) ||
                     (p.Description != null && regex.IsMatch(p.Description))));
        }
    }
}