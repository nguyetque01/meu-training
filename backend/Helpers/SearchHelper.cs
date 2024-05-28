using System.Linq;
using System.Text.RegularExpressions;
using backend.Models;
using System.Linq.Dynamic.Core;

namespace backend.Helpers
{
    public class SearchHelper
    {
        public IQueryable<Product> ApplyProductSearchFilter(IQueryable<Product> query, string search, string searchColumn)
        {
            search = search.ToLower();
            switch (searchColumn.ToLower())
            {
                case "id":
                    return query.Where(p => p.Id.ToString().Equals(search));
                case "code":
                    return query.Where(p => p.Code.ToLower().Equals(search) ||
                                            p.Code.ToLower().StartsWith($"{search} ") ||
                                            p.Code.ToLower().EndsWith($" {search}"));
                case "name":
                    return query.Where(p => p.Name.ToLower().Equals(search) ||
                                            p.Name.ToLower().Contains($" {search} ") ||
                                            p.Name.ToLower().StartsWith($"{search} ") ||
                                            p.Name.ToLower().EndsWith($" {search}"));
                case "category":
                    return query.Where(p => p.Category.ToLower().Equals(search) ||
                                            p.Category.ToLower().Contains($" {search} ") ||
                                            p.Category.ToLower().StartsWith($"{search} ") ||
                                            p.Category.ToLower().EndsWith($" {search}"));
                case "brand":
                    return query.Where(p => p.Brand != null &&
                                            (p.Brand.ToLower().Equals(search) ||
                                            p.Brand.ToLower().Contains($" {search} ") ||
                                            p.Brand.ToLower().StartsWith($"{search} ") ||
                                            p.Brand.ToLower().EndsWith($" {search}")));
                case "type":
                    return query.Where(p => p.Type != null &&
                                            (p.Type.ToLower().Equals(search) ||
                                            p.Type.ToLower().Contains($" {search} ") ||
                                            p.Type.ToLower().StartsWith($"{search} ") ||
                                            p.Type.ToLower().EndsWith($" {search}")));
                case "description":
                    return query.Where(p => p.Description != null &&
                                (p.Description.ToLower() == search ||
                                 p.Description.ToLower().Contains($" {search} ") ||
                                 p.Description.ToLower().StartsWith($"{search} ") ||
                                 p.Description.ToLower().EndsWith($" {search}") ||
                                 p.Description.ToLower().Contains($" {search}-") ||
                                 p.Description.ToLower().Contains($" {search}:") ||
                                 p.Description.ToLower().Contains($" {search},") ||
                                 p.Description.ToLower().Contains($" {search}.") ||
                                 p.Description.ToLower().Contains($" {search}?") ||
                                 p.Description.ToLower().Contains($" {search}!")));

                default:
                    return query.Where(p => p.Id.ToString().Equals(search) ||
                                            p.Code.ToLower().Equals(search) ||
                                            p.Code.ToLower().StartsWith($"{search} ") ||
                                            p.Code.ToLower().EndsWith($" {search}") ||
                                            p.Name.ToLower().Equals(search) ||
                                            p.Name.ToLower().Contains($" {search} ") ||
                                            p.Name.ToLower().StartsWith($"{search} ") ||
                                            p.Name.ToLower().EndsWith($" {search}") ||
                                            p.Category.ToLower().Equals(search) ||
                                            p.Category.ToLower().Contains($" {search} ") ||
                                            p.Category.ToLower().StartsWith($"{search} ") ||
                                            p.Category.ToLower().EndsWith($" {search}") ||
                                            (p.Brand != null && (p.Brand.ToLower().Equals(search) ||
                                                                p.Brand.ToLower().Contains($" {search} ") ||
                                                                p.Brand.ToLower().StartsWith($"{search} ") ||
                                                                p.Brand.ToLower().EndsWith($" {search}"))) ||
                                            (p.Type != null && (p.Type.ToLower().Equals(search) ||
                                                                p.Type.ToLower().Contains($" {search} ") ||
                                                                p.Type.ToLower().StartsWith($"{search} ") ||
                                                                p.Type.ToLower().EndsWith($" {search}"))) ||
                                            (p.Description != null && (p.Description.ToLower() == search ||
                                                                    p.Description.ToLower().Contains($" {search} ") ||
                                                                    p.Description.ToLower().StartsWith($"{search} ") ||
                                                                    p.Description.ToLower().EndsWith($" {search}") ||
                                                                    p.Description.ToLower().Contains($" {search}-") ||
                                                                    p.Description.ToLower().Contains($" {search}:") ||
                                                                    p.Description.ToLower().Contains($" {search},") ||
                                                                    p.Description.ToLower().Contains($" {search}.") ||
                                                                    p.Description.ToLower().Contains($" {search}?") ||
                                                                    p.Description.ToLower().Contains($" {search}!"))));
            }
        }
    }
}
