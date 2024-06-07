using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using backend.DTOs;
using backend.Models;
using Microsoft.IdentityModel.Tokens;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace backend.Helpers
{
    public class SearchHelper
    {
        private char[] punctuationMarks = { ' ', '-', ':', ',', '.', '?', '!' };
        private List<string> productColumns = new List<string> { "id", "code", "name", "category", "brand", "type", "description" };
        private List<string> brandColumns = new List<string> { "id", "name" };

        private bool IsAllColumnsSearch(string searchColumn)
        {
            return string.IsNullOrEmpty(searchColumn) || searchColumn.Equals("all", StringComparison.OrdinalIgnoreCase);
        }

        private bool IsValidSearchColumn(string table, string searchColumn)
        {
            switch (table)
            {
                case "product":
                    return productColumns.Contains(searchColumn, StringComparer.OrdinalIgnoreCase);
                case "brand":
                    return brandColumns.Contains(searchColumn, StringComparer.OrdinalIgnoreCase);
                default:
                    return false;
            }
        }

        public IQueryable<ProductDto> ApplyProductSearchFilter(IQueryable<ProductDto> query, string search, string searchColumn, string searchType)
        {
            string formattedSearch = search.ToLower();

            if (IsAllColumnsSearch(searchColumn) || IsValidSearchColumn("product", searchColumn))
            {
                return query.Where(BuildSearchCondition("product", searchColumn, searchType), formattedSearch);
            }        

            throw new ArgumentException("Invalid search column");            
        }

        public void UpdateProductSearchResults(List<ProductDto> products, string search, string searchColumn, string searchType)
        {
            string formattedSearch = search.ToLower();

            if (IsAllColumnsSearch(searchColumn)) 
            {
                foreach (var product in products)
                {
                    foreach (var column in productColumns)
                    {
                        UpdateProductSearchMatches(product, formattedSearch, column, searchType);
                    }
                }
            }

            if (IsValidSearchColumn("product", searchColumn))
            {
                foreach (var product in products)
                {
                    UpdateProductSearchMatches(product, formattedSearch, searchColumn, searchType);
                }
            }
        }

        private void UpdateProductSearchMatches(ProductDto product, string search, string searchColumn, string searchType)
        {
            string col = char.ToUpper(searchColumn[0]) + searchColumn.Substring(1);
            string value = (product.GetType().GetProperty(col)?.GetValue(product, null)?.ToString()?.ToLower()) ?? "default";
            List<int> foundPositions = new List<int>();

            var words = value.Split(' ');
            int searchLength = search.Split(' ').Length;
            int textLength = words.Length;

            for (int i = 0; i < textLength - searchLength + 1; i++)
            {
                string[] subWords = words.Skip(i).Take(searchLength).ToArray();
                string subText = string.Join(" ", subWords);

                if (IsMatchCondition(search, subText, searchType))
                {
                    foundPositions.Add(i);
                }
            }

            if (foundPositions.Any())
            {
                if (!product.SearchMatches.ContainsKey(searchColumn))
                {
                    product.SearchMatches[searchColumn] = foundPositions;
                }
                else
                {
                    product.SearchMatches[searchColumn].AddRange(foundPositions);
                }
            }
        }

        public IQueryable<Brand> ApplyBrandSearchFilter(IQueryable<Brand> query, string search, string searchColumn, string searchType)
        {
            string formattedSearch = search.ToLower();

            if (IsAllColumnsSearch(searchColumn) || IsValidSearchColumn("brand", searchColumn))
            {
                return query.Where(BuildSearchCondition("brand", searchColumn, searchType), formattedSearch);
            }

            throw new ArgumentException("Invalid search column");
        }

        public void UpdateBrandSearchResults(List<Brand> brands, string search, string searchColumn, string searchType)
        {
            string formattedSearch = search.ToLower();

            if (IsAllColumnsSearch(searchColumn))
            {
                foreach (var brand in brands)
                {
                    foreach (var column in brandColumns)
                    {
                        UpdateBrandSearchMatches(brand, formattedSearch, column, searchType);
                    }
                }
            }

            if (IsValidSearchColumn("brand", searchColumn))
            {
                foreach (var brand in brands)
                {
                    UpdateBrandSearchMatches(brand, formattedSearch, searchColumn, searchType);
                }
            }
        }

        private void UpdateBrandSearchMatches(Brand brand, string search, string searchColumn, string searchType)
        {
            string col = char.ToUpper(searchColumn[0]) + searchColumn.Substring(1);
            string value = (brand.GetType().GetProperty(col)?.GetValue(brand, null)?.ToString()?.ToLower()) ?? "default";
            List<int> foundPositions = new List<int>();

            var words = value.Split(' ');
            int searchLength = search.Split(' ').Length;
            int textLength = words.Length;

            for (int i = 0; i < textLength - searchLength + 1; i++)
            {
                string[] subWords = words.Skip(i).Take(searchLength).ToArray();
                string subText = string.Join(" ", subWords);

                if (IsMatchCondition(search, subText, searchType))
                {
                    foundPositions.Add(i);
                }
            }

            if (foundPositions.Any())
            {
                if (!brand.SearchMatches.ContainsKey(searchColumn))
                {
                    brand.SearchMatches[searchColumn] = foundPositions;
                }
                else
                {
                    brand.SearchMatches[searchColumn].AddRange(foundPositions);
                }
            }
        }

        private string BuildSearchCondition(string table, string column, string searchType = "")
        {
            List<string> conditions = new List<string>();

            if (IsAllColumnsSearch(column))
            {
                if (table.Equals("product"))
                {
                    foreach (string col in productColumns)
                    {
                        conditions.Add(BuildConditionExpression(col, searchType));
                    }
                } 
                else if (table.Equals("brand"))
                {
                    foreach (string col in brandColumns)
                    {
                        conditions.Add(BuildConditionExpression(col, searchType));
                    }
                }               
            }
            else
            {
                conditions.Add(BuildConditionExpression(column, searchType));
            }

            return string.Join(" || ", conditions);
        }

        private string BuildConditionExpression(string column, string searchType)
        {
            string processedColumn = $"{column}.ToString().ToLower()";

            if (searchType == "exact")
            {
                List<string> conditionParts = new List<string>();

                foreach (char punctuationMark in punctuationMarks)
                {
                    conditionParts.Add($"{processedColumn}.Equals(@0)");
                    conditionParts.Add($"{processedColumn}.StartsWith(@0 + \"{punctuationMark}\")");
                    conditionParts.Add($"{processedColumn}.EndsWith(\"{punctuationMark}\" + @0)");
                    conditionParts.Add($"{processedColumn}.Contains(\" \" + @0 + \"{punctuationMark}\")");
                }

                return string.Join(" || ", conditionParts);
            }

            return $"{processedColumn}.Contains(@0)";
        }

        private bool IsMatchCondition(string search, string text, string type)
        {
            string processedSearch = search.ToLower();
            string processedText = text.ToLower();

            if (type == "exact")
            {
                foreach (char punctuationMark in punctuationMarks)
                {
                    if (processedText.Equals(processedSearch) ||
                        processedText.StartsWith(processedSearch + punctuationMark) ||
                        processedText.EndsWith(punctuationMark + processedSearch) ||
                        processedText.Contains(" " + processedSearch + punctuationMark))
                    {
                        return true;
                    }
                }
                return false;
            }
            
            return processedText.Contains(processedSearch); 
        }
    }
}